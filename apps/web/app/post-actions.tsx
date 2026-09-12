"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface PostActionsProps {
    postId: string;
    authorId: string;
    viewerId: string | null;
}

export default function PostActions({ postId, authorId, viewerId }: PostActionsProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dropdownRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (viewerId !== authorId) return null;

    const handleDelete = async () => {
        const { error } = await supabase.from("sona_posts").delete().eq("id", postId);
        if (!error) {
            router.refresh();
        }
    };

    return (
        <div className="relative inline-block">
            <button
                ref={dropdownRef}
                onClick={() => setShowDropdown(!showDropdown)}
                className="h-5 w-5 rounded-full hover:bg-[#F0FDFA] flex items-center justify-center"
                aria-label="Post options"
            >
                ⋯
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-1 w-32 rounded-lg border border-[#E7E5E4] bg-white shadow-lg">
                    {showConfirm ? (
                        <div className="p-2">
                            <p className="text-sm text-[#78716C] mb-2">Delete this post?</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 rounded-lg px-2 py-1 text-sm text-[#78716C] hover:bg-[#F0FDFA]"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 rounded-lg px-2 py-1 text-sm text-[#DC2626] hover:bg-[#F0FDFA]"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="w-full rounded-lg px-3 py-2 text-sm text-[#DC2626] hover:bg-[#F0FDFA]"
                        >
                            Delete post
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}