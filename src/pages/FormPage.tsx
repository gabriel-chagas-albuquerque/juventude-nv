import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanityClient';
import { FORM_CATEGORIES_QUERY, FORM_QUESTIONS_QUERY } from '@/lib/queries';
import type { FormCategory, FormQuestion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, Send, Loader2, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { sendToGoogleSheets } from '@/lib/googleSheets';

// Esquema de validação básico
const baseSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  categoryId: z.string().min(1, 'Selecione o tipo de formulário'),
});

export default function FormPage() {
  const [categories, setCategories] = useState<FormCategory[]>([]);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dynamicErrors, setDynamicErrors] = useState<Record<string, string>>({});

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      categoryId: '',
      dynamic: {}
    }
  });

  const selectedCategoryId = watch('categoryId');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await client.fetch(FORM_CATEGORIES_QUERY);
        setCategories(data);
      } catch (error) {
        // Silently fail
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategoryId) {
      setQuestions([]);
      return;
    }

    async function fetchQuestions() {
      // Resetar estados imediatamente para forçar a exibição do skeleton
      setQuestions([]);
      setLoadingQuestions(true);
      setDynamicErrors({}); // Limpar erros dinâmicos

      try {
        const data = await client.fetch(FORM_QUESTIONS_QUERY, { categoryId: selectedCategoryId });
        setQuestions(data);
      } catch (error) {
        // Silently fail
      } finally {
        setLoadingQuestions(false);
      }
    }

    fetchQuestions();
  }, [selectedCategoryId]);

  const onSubmit = async (data: any) => {
    // 1. Validar campos dinâmicos manualmente de acordo com o Sanity
    const newErrors: Record<string, string> = {};
    const currentValues = watch('dynamic') || {};

    questions.forEach((q) => {
      const value = currentValues[q.fieldName];
      if (q.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        newErrors[q.fieldName] = 'Este campo é obrigatório';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setDynamicErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setDynamicErrors({});

    try {
      const categoryName = categories.find(c => c._id === selectedCategoryId)?.label || '';

      // 2. Mapeamento Estrito (Apenas campos definidos no Sanity)
      const sanitizedDynamicData: Record<string, any> = {};
      questions.forEach(q => {
        if (currentValues[q.fieldName] !== undefined) {
          sanitizedDynamicData[q.fieldName] = currentValues[q.fieldName];
        }
      });

      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        category: categoryName,
        ...sanitizedDynamicData
      };

      // 3. Enviar para o Google Sheets (Web App)
      const result = await sendToGoogleSheets(payload);

      if (result.success) {
        setIsSubmitted(true);
        reset();
        setTimeout(() => setIsSubmitted(false), 5000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 rounded-3xl border border-border bg-card max-w-lg w-full shadow-xl"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-fire-gradient flex items-center justify-center mx-auto"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary rounded-full -z-10"
            />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-gradient-fire">Deus te abençoe!</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Sua solicitação foi enviada com sucesso. Nossa equipe entrará em contato com você em breve.
          </p>
          <Button
            size="lg"
            className="w-full h-14 text-lg bg-fire-gradient hover:opacity-90 font-bold"
            onClick={() => setIsSubmitted(false)}
          >
            Enviar novo formulário
          </Button>
        </motion.div>
      </div>
    );
  }

  if (submitError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 rounded-3xl border border-border bg-card max-w-lg w-full shadow-xl"
        >
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto"
            >
              <XCircle className="w-12 h-12 text-red-500" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0, 0.3, 0],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-red-500/30 rounded-full -z-10"
            />
          </div>
          <h2 className="text-4xl font-extrabold mb-4 text-red-500">Ops! Algo deu errado.</h2>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Não foi possível completar o envio do formulário no momento.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-lg border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold"
            onClick={() => setSubmitError(false)}
          >
            Tentar novamente
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20 mb-4"
          >
            <ClipboardList size={16} />
            Atendimento & Integração
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-bold leading-tight"
          >
            Formulários de <span className="text-primary">Conexão</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            Estamos aqui para te ouvir, orar com você e te auxiliar em sua jornada com Cristo.
          </motion.p>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="p-6 sm:p-8">
            <CardTitle className="text-xl sm:text-2xl">Informações Gerais</CardTitle>
            <CardDescription className="text-sm sm:text-base">Preencha seus dados básicos para começarmos.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    {...register('name')}
                    className={cn(
                      "bg-white text-black placeholder:text-gray-500",
                      errors.name ? 'border-destructive ring-destructive/20' : ''
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    {...register('email')}
                    className={cn(
                      "bg-white text-black placeholder:text-gray-500",
                      errors.email ? 'border-destructive ring-destructive/20' : ''
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp / Telefone</Label>
                  <Input
                    id="phone"
                    placeholder="(00) 00000-0000"
                    {...register('phone')}
                    className={cn(
                      "bg-white text-black placeholder:text-gray-500",
                      errors.phone ? 'border-destructive ring-destructive/20' : ''
                    )}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.phone.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoryId">Tipo de Solicitação</Label>
                  {loadingCategories ? (
                    <Skeleton className="h-10 w-full rounded-lg" />
                  ) : (
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={cn(
                            "bg-white text-black h-12",
                            errors.categoryId ? 'border-destructive ring-destructive/20' : ''
                          )}>
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent position="popper" className="w-[var(--radix-select-trigger-width)] bg-secondary border-border shadow-2xl">
                            {categories.map((cat) => (
                              <SelectItem key={cat._id} value={cat._id} className="cursor-pointer py-3">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  )}
                  {errors.categoryId && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.categoryId.message as string}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative">
                {selectedCategoryId && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 pt-4 overflow-hidden"
                  >
                    <div className="space-y-2">
                      <Separator className="bg-border/50" />
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          Perguntas Específicas
                          {loadingQuestions && <Loader2 size={16} className="animate-spin text-primary" />}
                        </h3>
                        <p className="text-sm text-muted-foreground">Conte-nos mais detalhes sobre sua necessidade.</p>
                      </div>
                    </div>

                    <AnimatePresence mode="popLayout" initial={false}>
                      {loadingQuestions ? (
                        <motion.div
                          key="skeleton-loader"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-20 w-full rounded-lg" />
                          </div>
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-10 w-full rounded-lg" />
                          </div>
                        </motion.div>
                      ) : questions.length > 0 ? (
                        <motion.div
                          key={`questions-${selectedCategoryId}`}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="space-y-4"
                        >
                          {questions.map((q) => (
                            <div key={q._id} className="space-y-2">
                              <Label className="text-sm font-semibold">
                                {q.question} {q.required && <span className="text-primary">*</span>}
                              </Label>
                              {q.fieldType === 'textarea' ? (
                                <Textarea
                                  placeholder={q.placeholder}
                                  {...register(`dynamic.${q.fieldName}` as any)}
                                  className={cn(
                                    "bg-white text-black placeholder:text-gray-500 transition-all min-h-[100px]",
                                    dynamicErrors[q.fieldName] && "border-destructive ring-destructive/20"
                                  )}
                                />
                              ) : (
                                <Input
                                  type={q.fieldType}
                                  placeholder={q.placeholder}
                                  {...register(`dynamic.${q.fieldName}` as any)}
                                  className={cn(
                                    "bg-white text-black placeholder:text-gray-500 transition-all h-12",
                                    dynamicErrors[q.fieldName] && "border-destructive ring-destructive/20"
                                  )}
                                />
                              )}
                              {dynamicErrors[q.fieldName] && (
                                <p className="text-xs text-destructive flex items-center gap-1">
                                  <AlertCircle size={12} /> {dynamicErrors[q.fieldName]}
                                </p>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="no-questions"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="p-8 border border-dashed rounded-lg text-center bg-muted/20"
                        >
                          <p className="text-muted-foreground">Nenhuma pergunta adicional necessária para este tipo.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg font-bold bg-fire-gradient hover:opacity-90 transition-opacity"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar Solicitação
                      <Send className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
