import {
  currentShiftAtom,
  isAuthenticatedAtom,
  logoutAtom,
  tokenAtom,
  userAtom,
} from "@/state";
import userSVG from "@/static/user.svg";
import dayjs from "dayjs";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(userAtom);
  const currentShift = useAtomValue(currentShiftAtom);
  const navigate = useNavigate();
  const logout = useSetAtom(logoutAtom);
  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    console.log(token);
  }, [token]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex w-full items-center space-x-2 bg-white px-3 py-2">
      <div className="flex items-center space-x-2">
        <img className="h-[32px] w-[32px]" src={userSVG} />
        <div>
          <p className="text-xs font-semibold">{user?.name}</p>
          <div className="text-2xs text-subtitle">
            <span>Ca </span>
            <Link to="/manage-shift" className="text-primary">
              #{currentShift?.id}
            </Link>
            <span>
              {" "}
              (mở lúc{" "}
              {dayjs(currentShift?.beginDate).format("HH:mm DD/MM/YYYY")})
            </span>
          </div>
        </div>
      </div>
      {/* <button
        onClick={() => {
          logout();
          navigate("/login", { replace: true });
        }}
      >
        Logout
      </button> */}
    </div>
  );
};

export default Profile;
