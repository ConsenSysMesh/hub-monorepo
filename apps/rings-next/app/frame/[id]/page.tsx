import type { Metadata } from 'next'
import { getFrameMetadata } from '@coinbase/onchainkit/frame';
import React from "react";
import { redirect } from "next/navigation";

type Props = {
    params: { id: string }
}

export async function generateMetadata(
    { params }: Props,
): Promise<Metadata> {
    // read route params
    const id = params.id

    const frameMetadata = getFrameMetadata({
        buttons: [
            {
                label: `📖 Guide`,
            },
            {
                label: `👤✅ Check My FID`,
            },
            {
                action: 'link',
                label: `🏆 Dashboard`,
                target: `${process.env.NEXT_PUBLIC_URL}/bot/${id}`
            },
        ],
        image: `${process.env.NEXT_PUBLIC_API_URL}/api/public/images/initial.png`,
        postUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/frames/${id}`,
    });


    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_URL!),
        title: 'tipster.bot',
        description: '',
        openGraph: {
            title: 'tipster.bot',
            description: '',
            images: [`${process.env.NEXT_PUBLIC_API_URL}/api/public/initial.png`],
        },
        other: {
            ...frameMetadata,
        },
    }
}

export default function Page({ params }: Props) {
    redirect("/");
    return (
        <>
        </>
    )
}