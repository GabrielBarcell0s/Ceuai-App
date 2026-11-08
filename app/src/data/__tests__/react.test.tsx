import { act, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { observar, type BancoObservavel } from '@/data/datasources/local/observar';
import {
  RepositoriosProvider,
  SessaoProvider,
  usePode,
  useObservavel,
  useSessao,
} from '@/data/react';
import type { ContaRepository, Observavel, Usuario } from '@/domain';

function sujeito<T>() {
  let ouvinte: ((v: T) => void) | null = null;
  const obs: Observavel<T> = {
    subscribe(o) {
      ouvinte = o;
      return () => (ouvinte = null);
    },
  };
  return { obs, emitir: (v: T) => ouvinte?.(v) };
}

function Mostra({ obs }: { obs: Observavel<string> }) {
  const l = useObservavel(obs);
  return <Text>{l.estado === 'pronto' ? l.valor : l.estado}</Text>;
}

describe('infra de dados para as telas', () => {
  it('useObservavel: carregando até a primeira emissão, depois o valor', async () => {
    const s = sujeito<string>();
    await render(<Mostra obs={s.obs} />);
    expect(screen.getByText('carregando')).toBeTruthy();
    await act(async () => s.emitir('pronto!'));
    expect(screen.getByText('pronto!')).toBeTruthy();
  });

  it('sessão vem do repositório de contas e libera ações pelo papel', async () => {
    const s = sujeito<Usuario | null>();
    const contas = { sessaoAtual: () => s.obs } as unknown as ContaRepository;
    function Estado() {
      const sessao = useSessao();
      const giras = usePode('gerenciar_giras');
      return <Text>{`${sessao.estado} ${giras}`}</Text>;
    }
    await render(
      <RepositoriosProvider repositorios={{ contas }}>
        <SessaoProvider>
          <Estado />
        </SessaoProvider>
      </RepositoriosProvider>,
    );
    expect(screen.getByText('carregando false')).toBeTruthy();
    await act(async () =>
      s.emitir({ id: 'u', terreiroId: 't', nome: 'Beto', email: 'b@c.org', papel: 'controlador' }),
    );
    expect(screen.getByText('ativa false')).toBeTruthy();
    await act(async () => s.emitir(null));
    expect(screen.getByText('sem_sessao false')).toBeTruthy();
  });

  it('sem repositório de contas não há sessão', async () => {
    function Estado() {
      return <Text>{useSessao().estado}</Text>;
    }
    await render(
      <SessaoProvider>
        <Estado />
      </SessaoProvider>,
    );
    expect(screen.getByText('sem_sessao')).toBeTruthy();
  });

  it('observar: SQL local vira Observavel e cancela ao sair', () => {
    let resultado: ((r: { rows: { _array: Record<string, unknown>[] } }) => void) | undefined;
    let sinal: AbortSignal | undefined;
    const db: BancoObservavel = {
      watch: (_sql, _p, h, o) => {
        resultado = h.onResult;
        sinal = o.signal;
      },
    };
    const visto: string[][] = [];
    const sair = observar(db, 'select nome from giras', [], (l) =>
      l.map((x) => String(x.nome)),
    ).subscribe((v) => visto.push(v));
    resultado?.({ rows: { _array: [{ nome: 'a' }, { nome: 'b' }] } });
    expect(visto).toEqual([['a', 'b']]);
    sair();
    expect(sinal?.aborted).toBe(true);
  });
});
