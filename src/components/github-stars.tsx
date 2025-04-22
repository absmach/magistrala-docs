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
        <Button
            variant="outline"
            className=" tw-rounded-md tw-items-center"
            asChild={true}
        >
            <Link
                href={"https://github.com/absmach/magistrala"}
                className="tw-grid tw-grid-cols-2 tw-font-semibold tw-flex tw-justify-center tw-items-center web-link"
            >
                <div className="tw-flex tw-flex-row tw-items-center tw-gap-1 tw-mr-auto">
                    <Github />
                    Stars
                </div>
                <span className="tw-border-l-2 tw-flex tw-justify-center">
                    {stars !== null ? stars.toLocaleString() : "54"}{" "}
                </span>
            </Link>
        </Button>
    );
};
