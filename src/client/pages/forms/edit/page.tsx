import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";
import type {
  Form,
  Question,
  CreateQuestionDto,
  QuestionType,
  UpdateFormDto,
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowLeft,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Settings,
} from "lucide-react";

// Question validation schema
const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  type: z.enum([
    "TEXT",
    "TEXTAREA",
    "NUMBER",
    "EMAIL",
    "RADIO",
    "CHECKBOX",
    "SELECT",
    "DATE",
  ]),
  required: z.boolean(),
  choices: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "TEXT", label: "Short Text" },
  { value: "TEXTAREA", label: "Long Text" },
  { value: "NUMBER", label: "Number" },
  { value: "EMAIL", label: "Email" },
  { value: "RADIO", label: "Multiple Choice (Single)" },
  { value: "CHECKBOX", label: "Multiple Choice (Multiple)" },
  { value: "SELECT", label: "Dropdown" },
  { value: "DATE", label: "Date" },
];

export default function FormEditorPage() {
  const { formId } = useParams<{ formId: string }>();
  const queryClient = useQueryClient();
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [isEditingForm, setIsEditingForm] = useState(false);
  const [editFormTitle, setEditFormTitle] = useState("");
  const [editFormDescription, setEditFormDescription] = useState("");

  // Fetch form with questions
  const { data: form, isLoading } = useQuery<Form>({
    queryKey: ["forms", formId],
    queryFn: async () => {
      const { data } = await api.get(`/api/forms/${formId}`);
      return data;
    },
    enabled: !!formId,
  });

  // Fetch questions
  const { data: questions = [] } = useQuery<Question[]>({
    queryKey: ["forms", formId, "questions"],
    queryFn: async () => {
      const { data } = await api.get(`/api/forms/${formId}/questions`);
      return data;
    },
    enabled: !!formId,
  });

  // Update form mutation
  const updateFormMutation = useMutation({
    mutationFn: async (formData: UpdateFormDto) => {
      const { data } = await api.put(`/api/forms/${formId}`, formData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms", formId] });
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setIsEditingForm(false);
    },
  });

  // Create question mutation
  const createQuestionMutation = useMutation({
    mutationFn: async (questionData: CreateQuestionDto) => {
      const { data } = await api.post(
        `/api/forms/${formId}/questions`,
        questionData,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms", formId, "questions"],
      });
      setIsAddingQuestion(false);
      reset();
    },
  });

  // Delete question mutation
  const deleteQuestionMutation = useMutation({
    mutationFn: async (questionId: string) => {
      await api.delete(`/api/forms/${formId}/questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms", formId, "questions"],
      });
    },
  });

  // Reorder questions mutation
  const reorderMutation = useMutation({
    mutationFn: async (questionIds: string[]) => {
      await api.patch(`/api/forms/${formId}/questions/reorder`, {
        questionIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["forms", formId, "questions"],
      });
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      required: false,
      type: "TEXT",
    },
  });

  const questionType = watch("type");
  const needsChoices = ["RADIO", "CHECKBOX", "SELECT"].includes(questionType);

  const onSubmitQuestion = (data: QuestionFormData) => {
    const questionData: CreateQuestionDto = {
      text: data.text,
      type: data.type,
      required: data.required,
    };

    if (needsChoices && data.choices) {
      const choicesArray = data.choices
        .split("\n")
        .map((c) => c.trim())
        .filter((c) => c.length > 0);

      if (choicesArray.length >= 2) {
        questionData.options = { choices: choicesArray };
      }
    }

    createQuestionMutation.mutate(questionData);
  };

  const handleReorder = (questionId: string, direction: "up" | "down") => {
    const currentIndex = questions.findIndex((q) => q.id === questionId);
    if (currentIndex === -1) return;

    const newQuestions = [...questions];
    if (direction === "up" && currentIndex > 0) {
      [newQuestions[currentIndex], newQuestions[currentIndex - 1]] = [
        newQuestions[currentIndex - 1],
        newQuestions[currentIndex],
      ];
    } else if (direction === "down" && currentIndex < newQuestions.length - 1) {
      [newQuestions[currentIndex], newQuestions[currentIndex + 1]] = [
        newQuestions[currentIndex + 1],
        newQuestions[currentIndex],
      ];
    }

    reorderMutation.mutate(newQuestions.map((q) => q.id));
  };

  const handleEditForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormTitle.trim()) return;

    updateFormMutation.mutate({
      title: editFormTitle,
      description: editFormDescription || undefined,
    });
  };

  const openEditDialog = () => {
    if (form) {
      setEditFormTitle(form.title);
      setEditFormDescription(form.description || "");
      setIsEditingForm(true);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-border border-t-main mx-auto animate-spin"></div>
          <p className="text-lg font-bold">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Form Not Found</CardTitle>
            <CardDescription>
              The form you're looking for doesn't exist.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-border bg-secondary-background flex-shrink-0">
        <div className="w-full px-4 py-4 flex items-center gap-4 max-w-7xl mx-auto">
          <Button variant="neutral" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-heading truncate">{form.title}</h1>
            <p className="text-sm text-foreground/70 truncate">
              {form.description || "No description"}
            </p>
          </div>
          <Button variant="neutral" size="icon" onClick={openEditDialog}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Edit Form Dialog */}
      <Dialog open={isEditingForm} onOpenChange={setIsEditingForm}>
        <DialogContent>
          <form onSubmit={handleEditForm}>
            <DialogHeader>
              <DialogTitle>Edit Form Settings</DialogTitle>
              <DialogDescription>
                Update your form title and description
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Form Title</Label>
                <Input
                  id="edit-title"
                  value={editFormTitle}
                  onChange={(e) => setEditFormTitle(e.target.value)}
                  placeholder="Customer Feedback Survey"
                  required
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Input
                  id="edit-description"
                  value={editFormDescription}
                  onChange={(e) => setEditFormDescription(e.target.value)}
                  placeholder="Help us improve our service"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={updateFormMutation.isPending}>
                {updateFormMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="neutral"
                onClick={() => setIsEditingForm(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <main className="flex-1 w-full px-4 py-8 mx-auto max-w-4xl">
        {/* Questions List */}
        <div className="mb-8 space-y-4">
          <h2 className="text-xl font-heading">
            Questions ({questions.length})
          </h2>

          {questions.length === 0 && !isAddingQuestion && (
            <Card className="text-center py-8">
              <CardContent>
                <p className="text-foreground/70 mb-4">
                  No questions yet. Add your first question to get started.
                </p>
              </CardContent>
            </Card>
          )}

          {questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-main text-main-foreground border-2 border-border text-xs font-bold">
                        Q{index + 1}
                      </span>
                      <span className="px-2 py-1 bg-secondary-background border-2 border-border text-xs font-bold">
                        {
                          QUESTION_TYPES.find((t) => t.value === question.type)
                            ?.label
                        }
                      </span>
                      {question.required && (
                        <span className="text-xs font-bold text-red-600">
                          REQUIRED
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-lg">{question.text}</CardTitle>
                    {question.options?.choices && (
                      <CardDescription className="mt-2">
                        Choices: {question.options.choices.join(", ")}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={() => handleReorder(question.id, "up")}
                      disabled={index === 0 || reorderMutation.isPending}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={() => handleReorder(question.id, "down")}
                      disabled={
                        index === questions.length - 1 ||
                        reorderMutation.isPending
                      }
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="neutral"
                      onClick={() => {
                        if (confirm("Delete this question?")) {
                          deleteQuestionMutation.mutate(question.id);
                        }
                      }}
                      disabled={deleteQuestionMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Add Question Form */}
        {!isAddingQuestion ? (
          <Button onClick={() => setIsAddingQuestion(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </Button>
        ) : (
          <Card>
            <form onSubmit={handleSubmit(onSubmitQuestion)}>
              <CardHeader>
                <CardTitle>Add New Question</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-2 ">
                  <Label htmlFor="text">Question Text</Label>
                  <Input
                    id="text"
                    placeholder="What is your name?"
                    {...register("text")}
                  />
                  {errors.text && (
                    <p className="text-sm text-red-600 font-medium">
                      {errors.text.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Question Type</Label>
                  <Select
                    value={questionType}
                    onValueChange={(value) =>
                      setValue("type", value as QuestionType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {QUESTION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {needsChoices && (
                  <div className="space-y-2">
                    <Label htmlFor="choices">
                      Choices (one per line, minimum 2)
                    </Label>
                    <textarea
                      id="choices"
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-border rounded-base bg-secondary-background text-foreground font-base focus:outline-hidden focus:ring-2 focus:ring-ring"
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      {...register("choices")}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 w-full">
                  <Checkbox
                    id="required"
                    checked={watch("required")}
                    onCheckedChange={(checked) =>
                      setValue("required", !!checked)
                    }
                  />
                  <Label htmlFor="required" className="cursor-pointer">
                    Required question
                  </Label>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  type="submit"
                  disabled={createQuestionMutation.isPending}
                >
                  {createQuestionMutation.isPending
                    ? "Adding..."
                    : "Add Question"}
                </Button>
                <Button
                  type="button"
                  variant="neutral"
                  onClick={() => {
                    setIsAddingQuestion(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}
