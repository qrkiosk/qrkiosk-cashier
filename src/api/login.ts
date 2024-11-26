import axios from "axios";

import { AuthResult } from "../types/user";
import { Response } from "./common";
import { BASE_URL } from "./constants";

export const authenticate = (credentials: {
  username: string;
  password: string;
}) => axios.post<Response<AuthResult>>(`${BASE_URL}/auth/login`, credentials);
