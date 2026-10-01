import { calcularResultado } from './alunos.js';

export function gerarRelatorio(alunos, filtrar = () => true, formatar = (aluno) => aluno, comparar) {
  if (!Array.isArray(alunos)) throw new TypeError('A coleção de alunos deve ser um array.');
  let resultado = alunos.filter(filtrar);
  if (comparar) resultado.sort(comparar);
  return resultado.map(formatar);
}

export function criarFiltro({ mediaMinima, curso } = {}) {
  const cursoNormalizado = curso?.trim().toLocaleLowerCase('pt-BR');
  return (aluno) => {
    if (cursoNormalizado && aluno.curso.trim().toLocaleLowerCase('pt-BR') !== cursoNormalizado) return false;
    if (mediaMinima !== undefined && calcularResultado(aluno).media < mediaMinima) return false;
    return true;
  };
}

export function gerarRelatorios(alunos, { mediaMinima = 6, curso = 'Computação' } = {}) {
  const resultados = alunos.map((aluno) => calcularResultado(aluno, mediaMinima));

  const aprovadosPorNome = gerarRelatorio(
    resultados,
    (aluno) => aluno.situacao === 'Aprovado',
    (aluno) => `${aluno.nome} — média ${aluno.media.toFixed(2)}`,
    (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  );

  const reprovadosPorMedia = gerarRelatorio(
    resultados,
    (aluno) => aluno.situacao === 'Reprovado',
    (aluno) => `${aluno.nome} — média ${aluno.media.toFixed(2)}`,
    (a, b) => a.media - b.media || a.nome.localeCompare(b.nome, 'pt-BR'),
  );

  const csv = gerarRelatorio(
    resultados,
    criarFiltro({ curso }),
    (aluno) => [aluno.matricula, aluno.nome, aluno.email, aluno.curso, aluno.media.toFixed(2)].map(csvCampo).join(','),
    (a, b) => a.nome.localeCompare(b.nome, 'pt-BR'),
  );

  const cursos = new Map();
  for (const aluno of resultados) {
    const registro = cursos.get(aluno.curso) ?? { quantidade: 0, somaMedias: 0 };
    registro.quantidade += 1;
    registro.somaMedias += aluno.media;
    cursos.set(aluno.curso, registro);
  }
  const resumoPorCurso = [...cursos.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([nome, dados]) => ({
      curso: nome,
      quantidade: dados.quantidade,
      mediaGeral: Number((dados.somaMedias / dados.quantidade).toFixed(2)),
    }));

  return {
    aprovadosPorNome,
    reprovadosPorMedia,
    alunosDoCursoCsv: ['matricula,nome,email,curso,media', ...csv].join('\n'),
    resumoPorCurso,
  };
}

function csvCampo(valor) {
  const texto = String(valor ?? '');
  return /[",\r\n]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
}
