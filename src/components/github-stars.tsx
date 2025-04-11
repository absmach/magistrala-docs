import React, { useEffect, useState } from 'react';
import { Button } from "./ui/button";
import Link from "@docusaurus/Link";
import { Github } from 'lucide-react';

export const GithubStarButton = () => {
    const [stars, setStars] = useState<number | null>(null);

    useEffect(() => {
        const fetchStars = async () => {
            try {
                const response = await fetch("https://api.github.com/repos/absmach/magistrala");
                const data = await response.json();
                setStars(data.stargazers_count);
            } catch (error) {
                console.error('Error fetching GitHub stars:', error);
            }
        };

        fetchStars();
    }, []);

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="outline"
                asChild={true}
            >
                <Link
                    href={"https://github.com/absmach/magistrala"}
                    className="web-link"
                >
                    <Github />
                    Star:
                    < span className="ml-2 font-semibold" >
                        {stars !== null ? stars.toLocaleString() : "54"
                        }
                    </span >
                </Link>
            </Button>
        </div>
    );
};
