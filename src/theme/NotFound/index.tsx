import React, {type ReactNode} from 'react';
import Layout from '@theme/Layout';
import NotFoundContent from '@theme/NotFound/Content';

export default function Index(): ReactNode {
  return (
    <>
      <Layout>
        <NotFoundContent />
      </Layout>
    </>
  );
}
