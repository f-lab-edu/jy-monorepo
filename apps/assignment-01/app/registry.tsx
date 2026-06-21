'use client';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useState, type ReactNode } from 'react';

/**
 * App Router용 Emotion SSR registry.
 *
 * App Router는 서버 컴포넌트가 기본이라, 서버에서 생성된 Emotion 스타일이
 * 클라이언트로 주입되지 않으면 첫 렌더에서 스타일이 누락된다(FOUC).
 * 그래서 (1) 직접 만든 cache로 어떤 스타일이 삽입됐는지 추적하고,
 * (2) useServerInsertedHTML로 해당 <style> 태그를 SSR HTML에 끼워 넣는다.
 */
export function EmotionRegistry({ children }: { children: ReactNode }) {
  // cache와 삽입된 스타일 추적기를 첫 렌더에 한 번만 생성한다(useState 초기화 함수).
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: 'css' });
    // SSR 중 삽입된 스타일 이름을 모으기 위해 insert를 감싼다.
    cache.compat = true;
    const inserted: string[] = [];
    const prevInsert = cache.insert;
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    // 그동안 모은 스타일 이름을 비우고 반환한다.
    const flush = () => {
      const prev = inserted.slice();
      inserted.length = 0;
      return prev;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        data-emotion={`${cache.key} ${names.join(' ')}`}
        // 삽입된 스타일 규칙을 그대로 출력한다.
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
