import type { FSNode, Env } from '@cli-quest/shared';

export const testFS: FSNode = {
  type: 'directory',
  name: '',
  children: [
    {
      type: 'directory',
      name: 'home',
      children: [
        {
          type: 'directory',
          name: 'user',
          children: [
            {
              type: 'file',
              name: 'hello.txt',
              content: 'Hello World\nSecond line\nThird line',
            },
            {
              type: 'file',
              name: 'data.csv',
              content: 'name,age\nAlice,30\nBob,25\nCharlie,35',
            },
            {
              type: 'directory',
              name: 'docs',
              children: [
                {
                  type: 'file',
                  name: 'readme.md',
                  content: '# README\nThis is a readme file.',
                },
              ],
            },
            {
              type: 'directory',
              name: 'empty',
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

export const defaultEnv: Env = {
  HOME: '/home/user',
  USER: 'user',
  PWD: '/home/user',
  PATH: '/usr/bin',
};
