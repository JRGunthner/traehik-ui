import React from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import css from "menu/menu.module.scss";

interface Props {
    href: string;
    titulo: string;
    onClick?: () => Promise<void> | void;
}

export function NavItem(p: Props) {
    const router = useRouter();

    return (
        <Link className={css.link} href={p.href} data-ativo={p.href === router.pathname}>{p.titulo}</Link>
    );
}
