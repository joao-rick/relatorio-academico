import { criarCadastroAlunos } from './alunos.js';
import { gerarRelatorios } from './relatorios.js';

const cadastro = criarCadastroAlunos();

for (const aluno of [
  { matricula: '2024001', nome: ' Ana Silva ', email: 'ANA.SILVA@exemplo.com', curso: 'Computação', notas: [8, 9, 7] },
  { matricula: '2024002', nome: 'Bruno Costa', email: 'bruno@exemplo.com', curso: 'Computação', notas: [4, 5, 6] },
  { matricula: '2024003', nome: 'Carla Souza', email: 'carla@exemplo.com', curso: 'Matemática', notas: [9, 8] },
  { matricula: '2024004', nome: 'Daniel Lima', email: 'daniel@exemplo.com', curso: 'Matemática', notas: [] },
]) cadastro.cadastrar(aluno);

const relatorios = gerarRelatorios(cadastro.listar());
console.log('=== Aprovados por nome ===');
console.log(relatorios.aprovadosPorNome.length ? relatorios.aprovadosPorNome.join('\n') : 'Nenhum aluno aprovado.');
console.log('\n=== Reprovados da menor para a maior média ===');
console.log(relatorios.reprovadosPorMedia.length ? relatorios.reprovadosPorMedia.join('\n') : 'Nenhum aluno reprovado.');
console.log('\n=== Alunos de Computação (CSV) ===');
console.log(relatorios.alunosDoCursoCsv);
console.log('\n=== Resumo por curso ===');
console.log(relatorios.resumoPorCurso.length ? JSON.stringify(relatorios.resumoPorCurso, null, 2) : 'Nenhum aluno cadastrado.');
