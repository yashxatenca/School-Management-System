"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { navItems } from "./navConfig";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function TeacherSidebar({ open, setOpen }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:shadow-none lg:z-auto
        `}
      >
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl text-gray-900">
          Teacher Panel
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => {
            const hasSub = !!item.subItems;
            const active = isActive(item.href);

            return (
              <div key={item.name}>
                <button
                  onClick={() => {
                    if (hasSub) {
                      setOpenMenu(openMenu === item.name ? null : item.name);
                    } else {
                      router.push(item.href);
                      setOpen(false);
                    }
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${
                      active
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-gray-700 hover:bg-indigo-50/60 hover:text-indigo-700"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {hasSub &&
                    (openMenu === item.name ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    ))}
                </button>

                {hasSub && openMenu === item.name && (
                  <div className="ml-6 mt-1.5 space-y-1 animate-fade-in">
                    {item.subItems!.map((sub) => (
                      <Link
                        key={sub.name}
                        href={sub.href}
                        onClick={() => setOpen(false)}
                        className={`
                          flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm transition-all
                          ${
                            isActive(sub.href)
                              ? "bg-indigo-100/70 text-indigo-800 font-medium"
                              : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                          }
                        `}
                      >
                        <sub.icon className="w-4 h-4" />
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}