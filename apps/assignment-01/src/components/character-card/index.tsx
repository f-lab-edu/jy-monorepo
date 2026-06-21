import Image from 'next/image';

import type { Character } from '@/lib/rick-and-morty';

import { Card, Meta, Name } from './character-card.styles';

// 캐릭터 한 명을 카드로 표시한다. 표시 책임만 가지며 데이터 로직은 갖지 않는다.
export function CharacterCard({ character }: { character: Character }) {
  return (
    <Card>
      <Image src={character.image} alt={character.name} width={120} height={120} />
      <Name>{character.name}</Name>
      <Meta>
        {character.status} · {character.species}
      </Meta>
    </Card>
  );
}
