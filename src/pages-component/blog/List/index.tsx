/*
 * @Author: 黄鹏
 * @LastEditors: 黄鹏
 * @LastEditTime: 2024-07-28 23:55:27
 * @Description: 这是blog使用的业务组件
 */

import React from "react";
import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Avatar, List, Space } from "antd";
import Link from "next/link";

const data = Array.from({ length: 23 }).map((_, i) => ({
  href: "https://ant.design",
  title: `ant design part ${i}`,
  avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
  description:
    "Ant Design, a design language for background applications, is refined by Ant UED Team.",
  content:
    "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
}));

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const BlogList: React.FC = () => (
  <List
    itemLayout="vertical"
    size="large"
    pagination={{
      onChange: (page) => {
        console.log(page);
      },
      pageSize: 5,
    }}
    dataSource={data}
    footer={
      <div>
        <b>ant design</b> footer part
      </div>
    }
    renderItem={(item) => (
      <List.Item
        key={item.title}
        actions={[
          <IconText
            icon={StarOutlined}
            text="156"
            key="list-vertical-star-o"
          />,
          <IconText
            icon={LikeOutlined}
            text="156"
            key="list-vertical-like-o"
          />,
          <IconText
            icon={MessageOutlined}
            text="2"
            key="list-vertical-message"
          />,
        ]}
      >
        <List.Item.Meta
          avatar={<Avatar src={item.avatar} />}
          title={<Link href={"blog/detail"}>Go Blog/Detail</Link>}
          description={item.description}
        />
        {/* {item.content} */}
      </List.Item>
    )}
  />
);

export default BlogList;
