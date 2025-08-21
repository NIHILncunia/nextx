import path from 'path';
import fs from 'fs-extra';
import { findUp } from 'find-up';
import yaml from 'js-yaml';
import { glob } from 'glob';
import createJiti from 'jiti';

// ESM에서 __dirname을 사용하기 위한 설정
const __filename = import.meta.url;

export function generateIntermediatePaths(paths: string[]): Set<string> {
  const intermediatePaths = new Set<string>();
  for (const p of paths) {
    intermediatePaths.add(''); // Add root
    const pathSegments = p.split('/').filter((p): p is string => !!p);
    let currentPath = '';
    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[ i ];
      if (segment) {
        currentPath = path.join(currentPath, segment);
        intermediatePaths.add(currentPath);
      }
    }
  }
  return intermediatePaths;
}

export function kebabToPascalCase(str: string): string {
  return str
    .split(/[-_\s/]+|(?=\[)|(?<=])/)
    .filter(Boolean)
    .map(word => word.replace(/[\\\[\]]/g, ''))
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

export async function findProjectRoot(): Promise<string | undefined> {
  // 1. Find next.config.js upwards from CWD
  const nextConfigPath = await findUp([ 'next.config.js', 'next.config.mjs', 'next.config.ts' ]);
  if (nextConfigPath) {
    return path.dirname(nextConfigPath);
  }

  // 2. If not found, look for monorepo root
  const monorepoRootPath = await findUp('pnpm-workspace.yaml');
  if (!monorepoRootPath) {
    return undefined; // Not in a pnpm monorepo
  }
  const monorepoRoot = path.dirname(monorepoRootPath);

  // 3. Parse workspace file and find Next.js projects
  try {
    const workspaceFile = await fs.readFile(monorepoRootPath, 'utf8');
    const workspaceConfig = yaml.load(workspaceFile);

    // More robust type checking
    if (typeof workspaceConfig !== 'object' || workspaceConfig === null || !('packages' in workspaceConfig) || !Array.isArray((workspaceConfig as any).packages)) {
      return undefined;
    }

    const packages = (workspaceConfig as any).packages as (string | null)[];

    if (packages.length === 0) {
      return undefined;
    }

    const searchPatterns = packages
      .filter((p): p is string => !!p) // Filter out null/undefined entries
      .map(p =>
        path.join(monorepoRoot, p, 'next.config.{js,mjs,ts}').replace(/\\/g, '/')
      );

    for (const pattern of searchPatterns) {
      const found = await glob(pattern);
      if (found.length > 0) {
        return path.dirname(found[ 0 ]!); // Return first match
      }
    }
  } catch (error) {
    console.error('❌ pnpm-workspace.yaml 처리 중 오류가 발생했습니다:', error);
    return undefined;
  }

  return undefined;
}

export interface NextxConfig {
  lang?: 'ko' | 'en' | 'jp';
  aliases: {
    app: string;
    entities: string;
    components?: string;
    libs?: string;
  };
  useSrc?: boolean;
  componentInRoute?: boolean;
  componentCategory?: boolean;
  // 새로운 설정 구조 지원
  components?: {
    useCVA?: boolean;
    cnFunctionPath?: string;
  };
  paths?: {
    components?: string;
    pages?: string;
    api?: string;
    entities?: string;
    libs?: string;
  };
  templates?: {
    useCustomTemplates?: boolean;
    customTemplatePath?: string;
  };
  // setMeta 사용 여부
  useSetMeta?: boolean;
}

const defaultConfig: NextxConfig = {
  lang: 'ko',
  aliases: {
    app: 'app',
    entities: 'app/_entities',
    components: 'components',
    libs: 'app/_libs',
  },
  useSrc: false,
  componentInRoute: true,
  componentCategory: false,
  // 새로운 설정 구조 기본값 (하위 호환성을 위해 유지)
  components: {
    useCVA: true,
    cnFunctionPath: '@/_libs',
  },
  paths: {
    components: 'components',
    pages: 'app',
    api: 'app/api',
    entities: '_entities',
    libs: '_libs',
  },
  templates: {
    useCustomTemplates: false,
    customTemplatePath: './nextx-templates',
  },
  // setMeta 사용 여부 (기본값 false)
  useSetMeta: false,
};

export async function loadConfig(cwd?: string): Promise<NextxConfig> {
  const configFiles = [ 'nextx.config.ts', 'nextx.config.js', 'nextx.config.json' ];
  const configPath = await findUp(configFiles, { cwd });

  if (!configPath) {
    return defaultConfig;
  }

  let userConfig: Partial<NextxConfig> = {};

  try {
    if (configPath.endsWith('.json')) {
      userConfig = await fs.readJson(configPath);
    } else {
      const jiti = createJiti(__filename);
      const loadedModule = jiti(configPath);
      userConfig = loadedModule.default || loadedModule;
    }
  } catch (error) {
    console.error(`❌ ${path.basename(configPath)} 파일을 읽거나 처리하는 중 오류가 발생했습니다:`, error);
    return defaultConfig; // Return default config on error
  }

  // Deep merge user config with default config
  return {
    ...defaultConfig,
    ...userConfig,
    aliases: {
      ...defaultConfig.aliases,
      ...(userConfig.aliases || {}),
    },
    components: {
      ...defaultConfig.components,
      ...(userConfig.components || {}),
    },
    paths: {
      ...defaultConfig.paths,
      ...(userConfig.paths || {}),
    },
    templates: {
      ...defaultConfig.templates,
      ...(userConfig.templates || {}),
    },
  };
}

export async function getMessages(lang: string = 'ko') {
  try {
    const langModule = await import(`./lang/${lang}.js`);
    return langModule[ lang ];
  } catch (error) {
    console.warn(`
⚠️  '${lang}' 언어 파일을 찾을 수 없어 한국어로 대체합니다.`);
    const { ko } = await import('./lang/ko.js');
    return ko;
  }
}

// 새로운 유틸리티 함수들
export function getAppPath(config: NextxConfig): string {
  return config.useSrc ? `src/${config.aliases.app}` : config.aliases.app;
}

export function getComponentsPath(config: NextxConfig, group?: string): string {
  const basePath = config.useSrc ? `src/${config.aliases.components || 'components'}` : (config.aliases.components || 'components');

  if (config.componentCategory && group) {
    return path.join(basePath, group);
  }

  return basePath;
}

export function shouldUseSrc(config: NextxConfig): boolean {
  return config.useSrc ?? false;
}

export function shouldComponentInRoute(config: NextxConfig): boolean {
  return config.componentInRoute ?? true;
}

export function shouldComponentCategory(config: NextxConfig): boolean {
  return config.componentCategory ?? false;
}

export function determineComponentPath(
  config: NextxConfig,
  group: string,
  routePath: string,
  componentName: string
): string {
  if (shouldComponentInRoute(config)) {
    // 컴포넌트를 라우트 내부에 생성
    const appPath = getAppPath(config);
    return path.join(appPath, `(${group})`, routePath, '_components', `${componentName}.tsx`);
  } else {
    // 컴포넌트를 공용 폴더에 생성
    const componentsPath = getComponentsPath(config, group);
    return path.join(componentsPath, `${componentName}.tsx`);
  }
}

export function getComponentImportPath(
  config: NextxConfig,
  group: string,
  routePath: string,
  componentName: string
): string {
  if (shouldComponentInRoute(config)) {
    // 라우트 내부 컴포넌트는 상대 경로로 import
    return `./_components/${componentName}`;
  } else {
    // 공용 컴포넌트는 절대 경로로 import
    // @가 app을 가리키므로, components 경로에서 app 부분을 제거
    const componentsPath = getComponentsPath(config, group);
    const relativePath = componentsPath.replace(`${config.aliases.app}/`, '');
    return `@/${relativePath}/${componentName}`;
  }
}

// 새로운 설정 구조를 위한 유틸리티 함수들
export function getPathWithSrc(config: NextxConfig, basePath: string): string {
  return config.useSrc ? `src/${basePath}` : basePath;
}

export function getComponentsPathNew(config: NextxConfig): string {
  const basePath = config.paths?.components || 'components';
  return getPathWithSrc(config, basePath);
}

export function getPagesPath(config: NextxConfig): string {
  const basePath = config.paths?.pages || 'app';
  return getPathWithSrc(config, basePath);
}

export function getApiPath(config: NextxConfig): string {
  const basePath = config.paths?.api || 'app/api';
  return getPathWithSrc(config, basePath);
}

export function getEntitiesPath(config: NextxConfig): string {
  const basePath = config.paths?.entities || '_entities';
  return getPathWithSrc(config, basePath);
}

export function getLibsPath(config: NextxConfig): string {
  const basePath = config.paths?.libs || '_libs';
  return getPathWithSrc(config, basePath);
}

export function shouldUseCVA(config: NextxConfig): boolean {
  return config.components?.useCVA ?? true;
}

export function getCnFunctionPath(config: NextxConfig): string {
  return config.components?.cnFunctionPath || '@/_libs';
}

export function shouldUseSetMeta(config: NextxConfig): boolean {
  return config.useSetMeta ?? false;
}
