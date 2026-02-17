import { AlarmType } from "@apis/types";
import { useAlarmSettingsMutation, useAlarmSettingsQuery } from "@/queries";
import { ALARM_SECTION_DATA } from "../constant";

export const useAlarmSettings = () => {
  const { disabledAlarmTypes, isPendingAlarmActiveStatus } =
    useAlarmSettingsQuery();
  const { updateAlarmActiveStatus } = useAlarmSettingsMutation();

  // 각 알림 상태
  const toggleStates: Record<string, boolean> = {};

  ALARM_SECTION_DATA.forEach((section) =>
    section.contents.forEach((item) => {
      const selected = disabledAlarmTypes ?? [];
      const hasAnyCategory = item.category.some((c) => selected.includes(c));

      toggleStates[item.name] = !hasAnyCategory;
    }),
  );

  const isAllAlarmOn = Object.values(toggleStates).every(Boolean);

  const handleToggle = (item: string) => {
    const category = ALARM_SECTION_DATA.flatMap(
      (section) => section.contents,
    ).find((content) => content.name === item)?.category;

    if (!category) {
      console.error(`Unknown alarm item: ${item}`);
      return;
    }
    updateAlarmActiveStatus([...category]);
  };

  const handleToggleAll = () => {
    if (!disabledAlarmTypes) return;

    const update = isAllAlarmOn
      ? Object.values(AlarmType)
      : [...disabledAlarmTypes];
    updateAlarmActiveStatus(update);
  };

  return {
    isAllAlarmOn,
    toggleStates,
    isPendingAlarmActiveStatus,
    handleToggle,
    handleToggleAll,
  };
};
