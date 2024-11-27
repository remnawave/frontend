import { ComponentProps } from 'react';
import { MDXProvider as MDXDefaultProvider } from '@mdx-js/react';

type MDXDefaultProviderProps = ComponentProps<typeof MDXDefaultProvider>;

type MDXProviderProps = Omit<MDXDefaultProviderProps, 'components'>;

const components: MDXDefaultProviderProps['components'] = {
  em: (props) => <em style={{ color: 'red' }} {...props} />,
};

export function MDXProvider(props: MDXProviderProps) {
  return <MDXDefaultProvider components={components} {...props} />;
}
