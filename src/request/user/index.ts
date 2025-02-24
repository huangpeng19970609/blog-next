import { request } from "@/request";
import { COMCOS } from "@/request/index";

export async function isVerifyToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return false;
  }
  const res = await request({
    url: COMCOS.BaseURL + "/user/verify-token",
    method: "get",
    data: {
      token,
    },
  });
  return res.code === 200;
}
