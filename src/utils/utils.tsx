import { settingType } from "../redux/settingsSlice";

export const toSnakeCase = (str: string): string => {
  return str
    .replace(/\s+/g, "_")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
};

export const snakeToTitle = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.toUpperCase())
    .join(" ");
};

export const groupSettingsByType = (settings: settingType[]) => {
  return settings.reduce((acc, setting) => {
    const category = snakeToTitle(
      setting.type.charAt(0).toUpperCase() + setting.type.slice(1)
    );
    acc[category] = acc[category] || [];
    acc[category].push({
      ...setting,
      keyName: setting.keyName
        .replace(
          /(^|_)(\w)/g,
          (_: any, __: any, letter: string) => " " + letter.toUpperCase()
        )
        .trim(),
      type: category,
    });
    return acc;
  }, {} as Record<string, typeof settings>);
};
