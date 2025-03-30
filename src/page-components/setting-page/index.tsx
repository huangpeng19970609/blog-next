import { useState, useEffect } from "react";
import {
  Modal,
  Tabs,
  Switch,
  Form,
  Button,
  message,
  Radio,
  Space,
  Tooltip,
  Alert,
} from "antd";
import { ColorPicker, theme } from "antd";
import {
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  SaveOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";
import styles from "./index.module.scss";
import {
  getThemeSettings,
  getUseCustomTheme,
  setThemeSettings,
  setUseCustomTheme,
} from "@/utils/cookie";
import { ColorUtils } from "@/utils/css";
import { homePageConfig, ThemeConfig } from "@/config/home-page";

interface SettingPageProps {
  visible: boolean;
  onClose: () => void;
}

interface ColorConfig {
  fontColor: string;
  bgColor: string;
  paddingColor: string;
  titleColor: string;
  buttonColor: string;
}

// 使用homePageConfig的第一个主题作为系统默认主题
const systemDefaultTheme = homePageConfig.themes[0];
const defaultColors: ColorConfig = {
  fontColor: systemDefaultTheme.fontColor,
  bgColor: systemDefaultTheme.bgColor,
  paddingColor: systemDefaultTheme.paddingColor,
  titleColor: systemDefaultTheme.titleColor,
  buttonColor: systemDefaultTheme.titleColor, // 按钮颜色默认使用标题颜色
};

const SettingPage: React.FC<SettingPageProps> = ({ visible, onClose }) => {
  const [useCustomTheme, setUseCustomThemeState] = useState<boolean>(false);
  const [colorConfig, setColorConfig] = useState<ColorConfig>(defaultColors);
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [form] = Form.useForm();

  // 存储原始设置状态，用于取消时恢复
  const [originalUseCustomTheme, setOriginalUseCustomTheme] =
    useState<boolean>(false);
  const [originalColorConfig, setOriginalColorConfig] =
    useState<ColorConfig>(defaultColors);

  // 获取antd主题token
  const { token } = theme.useToken();

  useEffect(() => {
    if (visible) {
      // 弹窗打开时加载保存的主题设置
      const savedUseCustomTheme = getUseCustomTheme();
      setUseCustomThemeState(savedUseCustomTheme);
      setOriginalUseCustomTheme(savedUseCustomTheme);

      const savedThemeSettings = getThemeSettings();
      const currentSettings = savedThemeSettings
        ? { ...defaultColors, ...savedThemeSettings }
        : { ...defaultColors };

      setColorConfig(currentSettings);
      setOriginalColorConfig(currentSettings);

      // 重置预设选择状态
      setSelectedPreset(null);
    }
  }, [visible]);

  useEffect(() => {
    // 设置表单初始值
    form.setFieldsValue(colorConfig);
  }, [colorConfig, form]);

  const handleUseCustomThemeChange = (checked: boolean) => {
    setUseCustomThemeState(checked);

    if (checked) {
      // 如果启用自定义主题，应用当前颜色设置
      applyThemeSettings(colorConfig);
    } else {
      // 如果禁用自定义主题，恢复系统默认主题
      restoreDefaultTheme();
    }
  };

  const restoreDefaultTheme = () => {
    // 使用homePageConfig的第一个主题作为系统默认主题
    ColorUtils.changeFontColor(systemDefaultTheme.fontColor);
    ColorUtils.changeMainColor(systemDefaultTheme.bgColor);
    ColorUtils.changePaddingColor(systemDefaultTheme.paddingColor);
    ColorUtils.changeTitleColor(systemDefaultTheme.titleColor);
    document.documentElement.style.setProperty(
      "--button-color",
      systemDefaultTheme.titleColor
    );
  };

  const applyThemeSettings = (settings: ColorConfig) => {
    ColorUtils.changeFontColor(settings.fontColor);
    ColorUtils.changeMainColor(settings.bgColor);
    ColorUtils.changePaddingColor(settings.paddingColor);
    ColorUtils.changeTitleColor(settings.titleColor);
    document.documentElement.style.setProperty(
      "--button-color",
      settings.buttonColor
    );
  };

  const handleFormValueChange = (changedValues: any, allValues: any) => {
    // 当表单值变化时，实时应用主题
    if (useCustomTheme) {
      // 构建新的颜色配置
      const updatedConfig = { ...colorConfig, ...changedValues };

      // 更新当前颜色配置状态（但不保存到cookie）
      setColorConfig(updatedConfig);

      // 立即应用颜色变化
      if (changedValues.fontColor) {
        ColorUtils.changeFontColor(changedValues.fontColor);
      }
      if (changedValues.bgColor) {
        ColorUtils.changeMainColor(changedValues.bgColor);
      }
      if (changedValues.paddingColor) {
        ColorUtils.changePaddingColor(changedValues.paddingColor);
      }
      if (changedValues.titleColor) {
        ColorUtils.changeTitleColor(changedValues.titleColor);
      }
      if (changedValues.buttonColor) {
        document.documentElement.style.setProperty(
          "--button-color",
          changedValues.buttonColor
        );
      }

      // 当颜色发生变化时，清除预设选择
      setSelectedPreset(null);
    }
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newColorConfig = {
        ...colorConfig,
        ...values,
      };
      setColorConfig(newColorConfig);
      setThemeSettings(newColorConfig);
      setUseCustomTheme(useCustomTheme);

      // 更新原始配置，以便下次打开弹窗时使用
      setOriginalColorConfig(newColorConfig);
      setOriginalUseCustomTheme(useCustomTheme);

      message.success("设置已保存");
    });
  };

  const handleReset = () => {
    // 重置为系统默认主题
    const systemDefault = {
      fontColor: systemDefaultTheme.fontColor,
      bgColor: systemDefaultTheme.bgColor,
      paddingColor: systemDefaultTheme.paddingColor,
      titleColor: systemDefaultTheme.titleColor,
      buttonColor: systemDefaultTheme.titleColor,
    };

    setColorConfig(systemDefault);
    form.setFieldsValue(systemDefault);
    setSelectedPreset(0); // 选中第一个预设

    if (useCustomTheme) {
      applyThemeSettings(systemDefault);
    }

    // 保存重置设置到cookie
    setThemeSettings(systemDefault);
  };

  const handleCancel = () => {
    // 取消时恢复到原始设置
    if (getUseCustomTheme()) {
      // 如果原来启用了自定义主题，恢复原始主题设置
      applyThemeSettings(originalColorConfig);
    } else {
      // 如果原来未启用自定义主题，恢复系统默认主题
      restoreDefaultTheme();
    }

    onClose();
  };

  // 选择预设主题
  const handlePresetThemeSelect = (index: number) => {
    const theme = homePageConfig.themes[index];
    const themeConfig = {
      fontColor: theme.fontColor,
      bgColor: theme.bgColor,
      paddingColor: theme.paddingColor,
      titleColor: theme.titleColor,
      buttonColor: theme.titleColor, // 按钮颜色使用标题颜色
    };

    setColorConfig(themeConfig);
    form.setFieldsValue(themeConfig);
    setSelectedPreset(index);

    if (useCustomTheme) {
      applyThemeSettings(themeConfig);
    }
  };

  return (
    <Modal
      title={
        <div className={styles.modalTitle}>
          <BgColorsOutlined /> 系统设置
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      className={styles.settingModal}
    >
      <Tabs
        defaultActiveKey="theme"
        items={[
          {
            key: "theme",
            label: "主题设置",
            children: (
              <div className={styles.themeSettings}>
                <div className={styles.useCustomTheme}>
                  <span>启用自定义主题：</span>
                  <Switch
                    checked={useCustomTheme}
                    onChange={handleUseCustomThemeChange}
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                  />
                </div>

                {useCustomTheme && (
                  <Alert
                    className={styles.themeAlert}
                    message="提示：启用自定义主题后，首页滚动将不再触发主题变化"
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                  />
                )}

                {/* 预设主题选择 */}
                <div className={styles.presetThemes}>
                  <div className={styles.sectionTitle}>主题预设：</div>
                  <div className={styles.themeGrid}>
                    {homePageConfig.themes.map((theme, index) => (
                      <Tooltip title="点击选择此主题" key={index}>
                        <div
                          className={`${styles.themeItem} ${
                            selectedPreset === index ? styles.selected : ""
                          }`}
                          style={{
                            backgroundColor: theme.bgColor,
                            borderColor: theme.paddingColor,
                          }}
                          onClick={() => handlePresetThemeSelect(index)}
                        >
                          <div
                            className={styles.themeSample}
                            style={{
                              color: theme.fontColor,
                              borderColor: theme.titleColor,
                            }}
                          >
                            Aa
                          </div>
                        </div>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                <Form
                  form={form}
                  layout="vertical"
                  disabled={!useCustomTheme}
                  initialValues={colorConfig}
                  onValuesChange={handleFormValueChange}
                  className={styles.colorForm}
                >
                  <div className={styles.colorFormRow}>
                    <Form.Item
                      name="fontColor"
                      label="字体颜色"
                      getValueFromEvent={(color) => color.toHexString()}
                    >
                      <ColorPicker mode={["single", "gradient"]} />
                    </Form.Item>

                    <Form.Item
                      name="bgColor"
                      label="背景颜色"
                      getValueFromEvent={(color) => color.toHexString()}
                    >
                      <ColorPicker mode={["single", "gradient"]} />
                    </Form.Item>
                  </div>

                  <div className={styles.colorFormRow}>
                    <Form.Item
                      name="paddingColor"
                      label="边距颜色"
                      getValueFromEvent={(color) => color.toHexString()}
                    >
                      <ColorPicker mode={["single", "gradient"]} />
                    </Form.Item>

                    <Form.Item
                      name="titleColor"
                      label="标题颜色"
                      getValueFromEvent={(color) => color.toHexString()}
                    >
                      <ColorPicker mode={["single", "gradient"]} />
                    </Form.Item>
                  </div>

                  <div className={styles.colorFormRow}>
                    <Form.Item
                      name="buttonColor"
                      label="按钮颜色"
                      getValueFromEvent={(color) => color.toHexString()}
                    >
                      <ColorPicker mode={["single", "gradient"]} />
                    </Form.Item>
                  </div>

                  <div className={styles.formActions}>
                    <Button onClick={handleReset} icon={<ReloadOutlined />}>
                      重置为默认
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSave}
                      icon={<SaveOutlined />}
                    >
                      保存设置
                    </Button>
                  </div>
                </Form>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default SettingPage;
