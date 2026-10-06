const { withDangerousMod, createRunOncePlugin } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const DEPLOYMENT_TARGET = '16.0';
const METRO_FALLBACK =
  'http://localhost:8081/.expo/.virtual-metro-entry.bundle?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true';

const withIosPodDeploymentTarget = (config) =>
  withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const podfilePath = path.join(modConfig.modRequest.platformProjectRoot, 'Podfile');

      if (!fs.existsSync(podfilePath)) {
        console.warn('[withIosSimulatorBuildFixes] Podfile not found — skipping deployment target patch');
        return modConfig;
      }

      let contents = fs.readFileSync(podfilePath, 'utf8');

      if (!contents.includes("build_configuration.build_settings['IPHONEOS_DEPLOYMENT_TARGET']")) {
        contents = contents.replace(
          /(\s*react_native_post_install\([\s\S]*?\n\s*\))/m,
          `$1

    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |build_configuration|
        build_configuration.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${DEPLOYMENT_TARGET}'
      end
    end`
        );
      }

      fs.writeFileSync(podfilePath, contents, 'utf8');
      return modConfig;
    },
  ]);

const withDebugMetroFallback = (config) =>
  withDangerousMod(config, [
    'ios',
    async (modConfig) => {
      const appDelegatePath = path.join(
        modConfig.modRequest.platformProjectRoot,
        modConfig.modRequest.projectName,
        'AppDelegate.swift'
      );

      if (!fs.existsSync(appDelegatePath)) {
        console.warn('[withIosSimulatorBuildFixes] AppDelegate.swift not found — skipping Metro fallback patch');
        return modConfig;
      }

      let contents = fs.readFileSync(appDelegatePath, 'utf8');
      const fallbackLine = `      ?? URL(string: "${METRO_FALLBACK}")`;

      if (!contents.includes(METRO_FALLBACK)) {
        contents = contents.replace(
          '    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")',
          `    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: ".expo/.virtual-metro-entry")
${fallbackLine}`
        );
      }

      fs.writeFileSync(appDelegatePath, contents, 'utf8');
      return modConfig;
    },
  ]);

const withIosSimulatorBuildFixes = (config) =>
  withDebugMetroFallback(withIosPodDeploymentTarget(config));

module.exports = createRunOncePlugin(
  withIosSimulatorBuildFixes,
  'withIosSimulatorBuildFixes',
  '1.0.0'
);
