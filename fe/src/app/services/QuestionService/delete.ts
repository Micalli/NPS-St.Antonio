import { httpClient } from "../httpClient";

export async function deleteQuestion(questionId: string) {
  
  const { data } = await httpClient.delete(`/perguntas/${questionId}`);

  return data;
}
