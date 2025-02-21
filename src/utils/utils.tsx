import { SettingType } from "../components/datatypes/DataTypes";

export const toSnakeCase = (str: string): string => {
  return str
    .replace(/\s+/g, "_")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
};

export const snakeToUpper = (str: string): string => {
  return str
    .split("_")
    .map((word) => word.toUpperCase())
    .join(" ");
};

export const groupSettingsByType = (settings: SettingType[]) => {
  return settings.reduce((acc, setting) => {
    const category = snakeToUpper(setting.type);
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
