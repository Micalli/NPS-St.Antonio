import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useModals } from "../../../../app/contexts/useModals";
import { useCallback, useState } from "react";
import { questionService } from "../../../../app/services/QuestionService";
import { RateQuestionParams } from "../../../../app/services/QuestionService/rate";

export function useFeedbackQuestionModalController() {
  const { closeFeedbackQuestionModal } = useModals();
  const [questionNote, setQuestionNote] = useState<string>();
  const [ratedQuestionId, setRatedQuestionId] = useState<string>();
  const [gradedQuestion, setGradedQuestion] = useState<any>();


  const onChange = (note: string) => {
    setQuestionNote(note.trim());
  };

  const handleFeedbackQuestion = useCallback(
    (questionId: string | undefined, questionGrade: number | undefined) => {
      setRatedQuestionId(questionId);
      setGradedQuestion(questionGrade);
    },
    []
  );

  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: RateQuestionParams) => {

      return questionService.rate(data);
    },
  });

   const mutateQueryRateQuestion = async (data: RateQuestionParams) => {
     try {

       await mutateAsync(data);

       queryClient.invalidateQueries({ queryKey: ["questions"] });
       toast.success("Avaliação enviada com sucesso!");
       closeFeedbackQuestionModal()

     } catch (error) {
       toast.error("Erro ao avaliar pergunta!");
     }
   };

  const rateAQuestion = async (data: RateQuestionParams) => {

   await mutateQueryRateQuestion(data);
  };

 
  return {
    onChange,
    isPending,
    questionNote,
    ratedQuestionId,
    gradedQuestion,
    rateAQuestion,
    mutateQueryRateQuestion,
    handleFeedbackQuestion,
  };
}
