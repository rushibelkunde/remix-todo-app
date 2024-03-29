import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "@remix-run/react";

import { LoaderFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";

import { isRouteErrorResponse, useRouteError } from "@remix-run/react";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <h1 className=" font-bold text-5xl text-red-700">
          {error.status} {error.statusText}
        </h1>
        <p className="font-semibold text-xl">{error.data.message}</p>
        <Link to={"/login"} className="text-semibold">
          try again
        </Link>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return user;
};

export const action: ActionFunction = async ({ request }) => {
  const user = authenticator.authenticate("form", request, {
    successRedirect: "/",
  });
  return user;
};

const Login = () => {
  const data = useActionData();

  console.log(data);

  const [loading, setLoading] = useState(false);
  return (
    <div>
      <h1 className="text-center font-semibold text-2xl mt-60 mb-5">Login</h1>
      <form method="POST" className="flex flex-col w-72 gap-2 m-auto">
        <input
          type="text"
          name="username"
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="username"
          defaultValue={"example"}
          required
        />

        <input
          type="password"
          name="password"
          defaultValue={"1234"}
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="password"
          required
        />

        {loading ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button className="bg-black w-32 rounded-xl p-2 text-white font-semibold m-auto">
            Login
          </button>
        )}
      </form>
      <h1 className="text-center text-zinc-500 mt-2">
        don't have an account?
        <Link to={"/register"}>
          <span className="font-semibold ml-2 cursor-pointer text-black text-center">
            Register
          </span>
        </Link>
      </h1>
    </div>
  );
};

export default Login;
