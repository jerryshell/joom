"use client";

import { getBrowserClient } from "@/lib/supabase/browserClient";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>();

  const browserClient = getBrowserClient();

  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
      } = await browserClient.auth.getUser();
      if (user) {
        setUser(user);
      }
    }

    fetchUser();
  }, []);

  return (
    <header className="border-gray-200 flex h-[90px] items-center border-b">
      <nav className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-2.5" href="/">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
          <h1 className="text-xl font-black -tracking-[0.1px] text-neutral-800">
            Joom
          </h1>
        </Link>
        {user && (
          <figure className="flex items-center gap-2.5">
            <button
              className="cursor-pointer"
              onClick={() => router.push(`/profile/${user.id}`)}
            >
              <Image
                src={user.user_metadata.avatar_url}
                alt="user avatar"
                width={36}
                height={36}
                className="rounded-full aspect-square"
              />
            </button>
            <button
              className="cursor-pointer"
              onClick={async () => {
                await browserClient.auth.signOut();
                router.push("/login");
              }}
            >
              <Image
                src="/assets/icons/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
            </button>
          </figure>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
