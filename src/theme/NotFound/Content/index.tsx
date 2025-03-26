import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { Frown, ArrowUpRight } from 'lucide-react';
import type { Props } from '@theme/NotFound/Content';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';

export default function NotFoundContent({ className }: Props): ReactNode {
  return (
    <main className={clsx('container margin-vert--xl', className)}>
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center">
          <Heading as="h1" className="tw-text-7xl">
            <Frown height="200" width="200" />
            <p className="tw-p-6">
              404
            </p>
          </Heading>
          <p className="tw-text-3xl tw-mb-2">
            Oops! Page not found.
          </p>
        <p className="tw-text-2xl tw-mb-2">
            The page you’re looking for doesn’t exist.
          </p>
          <Link
            href={"/"}
          className="web-link tw-underline hover:tw-text-primary hover:tw-scale-105 tw-transition-colors tw-flex tw-items-center tw-text-muted-foreground"
          >
            Go back to HomePage
          <ArrowUpRight className="tw-h-4 tw-w-4 tw-underline" />
          </Link>
        </div>
    </main>
  );
}
