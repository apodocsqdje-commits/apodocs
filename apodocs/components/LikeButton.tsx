"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleLikeDocument } from "@/actions/likeAction";

interface LikeButtonProps {
  documentId: string;
  initialLikes?: number;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const STORAGE_KEY = "apodocs_liked_docs";

export default function LikeButton({
  documentId,
  initialLikes = 0,
  size = "sm",
  showLabel = false,
}: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  // Sync with client-side localStorage to check if this user already liked the doc
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const likedIds: string[] = JSON.parse(stored);
        if (likedIds.includes(documentId)) {
          setIsLiked(true);
        }
      }
    } catch {
      // Ignore localStorage errors in private browsing
    }
  }, [documentId]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isPending) return;

    const willLike = !isLiked;
    // Optimistic UI update
    setIsLiked(willLike);
    setLikes((prev) => (willLike ? prev + 1 : Math.max(0, prev - 1)));
    setIsPending(true);

    try {
      // Update localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      let likedIds: string[] = stored ? JSON.parse(stored) : [];
      if (willLike) {
        if (!likedIds.includes(documentId)) likedIds.push(documentId);
      } else {
        likedIds = likedIds.filter((id) => id !== documentId);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(likedIds));

      // Invoke server action
      const res = await toggleLikeDocument(documentId, !willLike);
      if (res.success) {
        setLikes(res.likes);
      }
    } catch (err) {
      console.error("Like error:", err);
      // Revert optimistic update on failure
      setIsLiked(!willLike);
      setLikes((prev) => (willLike ? Math.max(0, prev - 1) : prev + 1));
    } finally {
      setIsPending(false);
    }
  };

  const isSmall = size === "sm";

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={isPending}
      title={isLiked ? "Retirer votre j'aime" : "J'aime ce document"}
      aria-label="Aimer le document"
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 cursor-pointer select-none active:scale-90 ${
        isSmall
          ? "px-2.5 py-1 text-xs"
          : "px-3.5 py-1.5 text-sm"
      } ${
        isLiked
          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
          : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-red-500"
      }`}
    >
      <Heart
        className={`transition-all duration-200 ${
          isSmall ? "w-3.5 h-3.5" : "w-4 h-4"
        } ${
          isLiked
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 group-hover:text-red-500"
        }`}
      />
      <span className="font-bold tabular-nums">{likes}</span>
      {showLabel && (
        <span className="hidden sm:inline font-normal text-gray-500 text-xs">
          {isLiked ? "Aimé" : "J'aime"}
        </span>
      )}
    </button>
  );
}
