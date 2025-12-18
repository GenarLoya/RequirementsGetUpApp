import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api";
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
import type { Form, CreateFormDto } from "@/types";
import { Plus, LogOut, FileText, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormDescription, setNewFormDescription] = useState("");

  // Fetch all forms
  const { data: forms, isLoading } = useQuery<Form[]>({
    queryKey: ["forms"],
    queryFn: async () => {
      const { data } = await api.get("/api/forms");
      return data;
    },
  });

  // Create form mutation
  const createFormMutation = useMutation({
    mutationFn: async (formData: CreateFormDto) => {
      const { data } = await api.post("/api/forms", formData);
      return data;
    },
    onSuccess: (newForm) => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setIsDialogOpen(false);
      setNewFormTitle("");
      setNewFormDescription("");
      // Redirect to edit page
      navigate(`/forms/${newForm.id}/edit`);
    },
  });

  // Delete form mutation
  const deleteFormMutation = useMutation({
    mutationFn: async (formId: string) => {
      await api.delete(`/api/forms/${formId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
    },
  });

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) return;

    createFormMutation.mutate({
      title: newFormTitle,
      description: newFormDescription || undefined,
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      {/* Header */}
      <header className="border-b-4 border-border bg-secondary-background flex-shrink-0">
        <div className="w-full px-4 py-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-heading truncate">Form Builder</h1>
            <p className="text-sm text-foreground/70 truncate">
              Welcome back, {user?.name}!
            </p>
          </div>
          <Button
            variant="neutral"
            onClick={handleLogout}
            className="flex-shrink-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-8 mx-auto max-w-7xl">
        {/* Create Form Button */}
        <div className="mb-8">
          <Button onClick={() => setIsDialogOpen(true)} size="lg">
            <Plus className="w-5 h-5 mr-2" />
            Create New Form
          </Button>
        </div>

        {/* Create Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <form onSubmit={handleCreateForm}>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>
                  Build a new form to collect responses
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Form Title</Label>
                  <Input
                    id="title"
                    value={newFormTitle}
                    onChange={(e) => setNewFormTitle(e.target.value)}
                    placeholder="Customer Feedback Survey"
                    required
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input
                    id="description"
                    value={newFormDescription}
                    onChange={(e) => setNewFormDescription(e.target.value)}
                    placeholder="Help us improve our service"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={createFormMutation.isPending}>
                  {createFormMutation.isPending ? "Creating..." : "Create Form"}
                </Button>
                <Button
                  type="button"
                  variant="neutral"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewFormTitle("");
                    setNewFormDescription("");
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Forms List */}
        <div>
          <h2 className="text-2xl font-heading mb-4">Your Forms</h2>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-border border-t-main mx-auto animate-spin mb-4"></div>
              <p className="text-foreground/70">Loading forms...</p>
            </div>
          ) : forms && forms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <Card key={form.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <FileText className="w-8 h-8 text-main" />
                      <div
                        className={`px-2 py-1 border-2 border-border text-xs font-bold ${
                          form.isActive ? "bg-green-200" : "bg-gray-200"
                        }`}
                      >
                        {form.isActive ? "ACTIVE" : "INACTIVE"}
                      </div>
                    </div>
                    <CardTitle className="mt-4">{form.title}</CardTitle>
                    <CardDescription>
                      {form.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/70">
                      Created {formatRelativeTime(form.createdAt)}
                    </p>
                  </CardContent>
                  <CardFooter className="gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/forms/${form.id}/edit`}>Edit</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="neutral"
                      onClick={() => {
                        if (
                          confirm(
                            "Delete this form? This action cannot be undone.",
                          )
                        ) {
                          deleteFormMutation.mutate(form.id);
                        }
                      }}
                      disabled={deleteFormMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto text-center py-12">
              <CardContent>
                <FileText className="w-16 h-16 mx-auto text-foreground/30 mb-4" />
                <CardTitle className="mb-2">No forms yet</CardTitle>
                <CardDescription>
                  Create your first form to start collecting responses
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
