import { isAuthenticatedAtom, logoutAtom, tokenAtom, userAtom } from "@/state";
import userSVG from "@/static/user.svg";
import { useAtomValue, useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();
  const logout = useSetAtom(logoutAtom);
  const token = useAtomValue(tokenAtom);

  if (!isAuthenticated) return null;

  return (
    <div className="flex w-full items-center space-x-2 bg-white px-3 py-2">
      <div className="flex items-center space-x-2">
        <img className="h-[32px] w-[32px]" src={userSVG} />
        <p className="text-sm">{user?.name}</p>
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
