let proximoId = 1;

const normalizarTexto = (valor) => String(valor ?? '').trim().replace(/\s+/g, ' ');

export function criarCadastroAlunos() {
  const alunos = [];

  function cadastrar({ matricula, nome, email, curso, notas = [] } = {}) {
    const dados = {
      matricula: normalizarTexto(matricula),
      nome: normalizarTexto(nome),
      email: normalizarTexto(email).toLowerCase(),
      curso: normalizarTexto(curso),
      notas,
    };

    if (!dados.matricula) throw new Error('A matrícula é obrigatória.');
    if (alunos.some((aluno) => aluno.matricula.toLowerCase() === dados.matricula.toLowerCase())) {
      throw new Error(`A matrícula "${dados.matricula}" já está cadastrada.`);
    }
    if (dados.nome.length < 3) throw new Error('O nome deve ter pelo menos três caracteres.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
      throw new Error('O e-mail informado não tem um formato válido.');
    }
    if (!dados.curso) throw new Error('O curso é obrigatório.');
    if (!Array.isArray(dados.notas) || dados.notas.some((nota) =>
      typeof nota !== 'number' || !Number.isFinite(nota) || nota < 0 || nota > 10)) {
      throw new Error('As notas devem ser números entre 0 e 10.');
    }

    const aluno = { id: proximoId++, ...dados, notas: [...dados.notas] };
    alunos.push(aluno);
    return aluno;
  }

  function buscarPorMatricula(matricula) {
    const chave = normalizarTexto(matricula).toLowerCase();
    return alunos.find((aluno) => aluno.matricula.toLowerCase() === chave) ?? null;
  }

  function removerPorMatricula(matricula) {
    const chave = normalizarTexto(matricula).toLowerCase();
    const indice = alunos.findIndex((aluno) => aluno.matricula.toLowerCase() === chave);
    if (indice < 0) return null;
    return alunos.splice(indice, 1)[0];
  }

  function listar() {
    return alunos.map((aluno) => ({ ...aluno, notas: [...aluno.notas] }));
  }

  return { cadastrar, buscarPorMatricula, removerPorMatricula, listar };
}

export function calcularResultado(aluno, mediaMinima = 6) {
  if (!Number.isFinite(mediaMinima) || mediaMinima < 0 || mediaMinima > 10) {
    throw new Error('A média mínima deve ser um número entre 0 e 10.');
  }
  const notas = Array.isArray(aluno.notas) ? aluno.notas : [];
  const media = notas.length ? notas.reduce((soma, nota) => soma + nota, 0) / notas.length : 0;
  return { ...aluno, notas: [...notas], media, situacao: notas.length && media >= mediaMinima ? 'Aprovado' : 'Reprovado' };
}
