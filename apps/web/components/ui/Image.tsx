import Image from "next/image";
import type { CSSProperties } from "react";

export default function SonaImage({
    src,
    alt,
    width,
    height,
    className = "",
    priority = false,
    fill = false,
    sizes,
    style,
}: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    style?: CSSProperties;
}) {
    const imgProps = {
        src,
        alt,
        className,
        priority,
        fill,
        sizes,
        style,
    };

    if (fill) {
        return <Image {...imgProps} />;
    }

    if (width && height) {
        return <Image {...imgProps} width={width} height={height} />;
    }

    return <Image {...imgProps} />;
}