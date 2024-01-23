import { useActionData, useNavigate, useRouteError } from "@remix-run/react";
import React, { useState } from "react";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import { Link } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return user;
};

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const name = form.get("name") as string;
  const username = form.get("username") as string;
  const password = form.get("password") as string;

  const user = await db.user.count({
    where: {
      username,
    },
  });

  if (user) {
    return { error: "user already exists" };
  } else {
    const hashedPass = await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        name,
        username,
        pass: hashedPass,
      },
    });

    return json(
      await authenticator.authenticate("form", request, {
        successRedirect: "/",
        failureRedirect: "/login",
        context: { formData: form },
      })
    );
  }
}

const Register = () => {
  const navigate = useNavigate();

  const data: any = useActionData();

  console.log(data);

  const [error, setError] = useState(data?.error || "");
  const [disable, setDisable] = useState(false);
  return (
    <div>
      <h1 className="text-center font-semibold text-2xl mt-60 mb-5">
        Register
      </h1>
      <form method="POST" className="flex flex-col w-72 gap-2 m-auto">
        <input
          type="text"
          name="name"
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="name"
          required
        />
        <input
          type="text"
          name="username"
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="username"
          required
        />

        <input
          type="password"
          name="password"
          className="bg-slate-100 p-2 rounded-xl"
          id=""
          placeholder="password"
          required
        />

        <button
          type="submit"
          className="bg-black w-32 rounded-xl p-2 text-white font-semibold m-auto"
          disabled={disable}
        >
          {disable ? "Registering..." : "Register"}
        </button>

        <h1 className="text-center text-zinc-500">
          already have an account?
          <Link to={"/login"}>
            <span className="font-semibold ml-2 cursor-pointer text-black">
              Login
            </span>
          </Link>
        </h1>

        <span className="text-center text-red-400 font-semibold">
          {error ? error : ""}
        </span>
      </form>
    </div>
  );
};

export default Register;
