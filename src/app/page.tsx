"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/shared/SplashScreen";
import { getSession } from "@/lib/auth";

export default function Page() {
	const router = useRouter();

	const [mounted, setMounted] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setMounted(true);

		const timer = setTimeout(() => {
			const session = getSession();

			if (session) {
				router.replace("/dashboard");
			} else {
				router.replace("/login");
			}

			setLoading(false);
		}, 3000);

		return () => clearTimeout(timer);
	}, [router]);

	if (!mounted) return null;

	if (loading) {
		return <SplashScreen />;
	}

	return null;
}