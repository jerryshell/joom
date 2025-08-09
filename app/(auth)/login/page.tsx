"use client";

import { getBrowserClient } from "@/lib/supabase/browserClient";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [isPending, setIsPending] = useState(false);

  const browserClient = getBrowserClient();

  const signInWithGithub = async () => {
    setIsPending(true);
    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000";
    await browserClient.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });
  };

  return (
    <main className="flex min-h-screen w-full flex-col-reverse justify-between overflow-hidden max-lg:gap-10 lg:flex-row">
      <aside className="bg-sky-400 flex w-full flex-col justify-between gap-6 px-6 py-10 lg:h-screen lg:w-1/2 lg:pl-10">
        <Link href="/" className="flex items-center gap-2.5">
          <h1 className="text-xl font-black -tracking-[0.5px] text-white">
            Joom
          </h1>
        </Link>

        <div className="flex items-center justify-center">
          <section className="flex w-full max-w-2xl flex-col items-center justify-center gap-8 px-6 sm:px-8">
            <figure className="flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt="star icon"
                  width={20}
                  height={20}
                  key={index}
                />
              ))}
            </figure>
            <p className="text-white text-center text-3xl font-semibold -tracking-[2px]">
              屏幕录制就该这么简单
              <br />
              快速、流畅，几秒内即可分享
            </p>
            <article className="flex flex-col items-center gap-2.5">
              <Image
                src="/assets/images/jerry.png"
                alt="jerry"
                width={64}
                height={64}
                className="rounded-full"
              />
              <div className="flex flex-col items-center gap-1">
                <h2 className="text-white text-base font-bold">Jerry</h2>
                <p className="text-sm font-normal -tracking-[0.5px] text-white">
                  <a
                    href="https://store.steampowered.com/app/3676310"
                    target="_blank"
                  >
                    独立游戏《异星幸存者》制作人
                  </a>{" "}
                  |{" "}
                  <a href="https://github.com/exsequi-studios" target="_blank">
                    Exsequi Studios
                  </a>
                </p>
              </div>
            </article>
          </section>
        </div>

        <a
          href="https://github.com/jerryshell"
          target="_blank"
          className="text-sm font-medium text-white"
        >
          © Jerry OSS {new Date().getFullYear()}
        </a>
      </aside>
      <aside className="flex w-full items-center justify-center px-10 py-10 lg:h-screen lg:w-1/2">
        <section className="rounded-xl shadow-xl flex w-full max-w-xl flex-col gap-8 bg-white px-5 py-7.5">
          <Link href="/" className="flex items-center justify-center gap-2.5">
            <Image
              src="/assets/icons/logo.svg"
              alt="logo"
              width={40}
              height={40}
            />
          </Link>
          <p className="text-neutral-800 text-center text-3xl font-bold -tracking-[2px]">
            立刻录制并分享你的第一个 <span className="text-sky-400">视频</span>
            ！
          </p>
          <button
            onClick={signInWithGithub}
            className="border-gray-200 text-neutral-800 flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-4xl border bg-white py-4 text-base font-semibold -tracking-[0.8px] disabled:cursor-not-allowed"
            disabled={isPending}
          >
            <Image
              src="/assets/icons/github.svg"
              alt="github icon"
              width={22}
              height={22}
            />
            <span>{isPending ? "登录中..." : "使用 GitHub 登录"}</span>
          </button>
        </section>
      </aside>
    </main>
  );
};

export default LoginPage;
