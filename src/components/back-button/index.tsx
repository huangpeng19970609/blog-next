import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface BackButtonProps {
  path?: string;
  className?: string;
}

const BackButton: FC<BackButtonProps> = ({ path, className }) => {
  const router = useRouter();

  const handleBack = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <div className="w-full flex items-start mb-4">
      <Button
        icon={<LeftOutlined />}
        onClick={handleBack}
        className={`hover:bg-gray-100 transition-colors duration-200 flex items-center text-gray-600 hover:text-gray-900 ${
          className ?? ""
        }`}
      >
        返回
      </Button>
    </div>
  );
};

export default BackButton;
