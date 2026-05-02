import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn, maskPhone, maskCPF, maskDate } from '@/lib/utils';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/lib/sanityClient';
import { FORM_CATEGORIES_QUERY } from '@/lib/queries';
import type { FormCategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ClipboardList, Send, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { sendToGoogleSheets } from '@/lib/googleSheets';
import { SEO } from '@/components/SEO';

// Esquema de validação básico
const baseSchema = z.object({
  name: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, 'Nome deve conter apenas letras'),
  email: z.string()
    .min(1, 'E-mail é obrigatório')
    .email('E-mail inválido'),
  phone: z.string()
    .min(1, 'Telefone é obrigatório')
    .refine((val) => {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 11;
    }, 'Telefone incompleto. Digite o DDD e todos os números.'),
  categoryId: z.string().min(1, 'Selecione o tipo de formulário'),
}).passthrough();

export default function FormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriaParam = searchParams.get('categoria');
  const [categories, setCategories] = useState<FormCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      categoryId: ''
    }
  });

  const selectedCategoryId = watch('categoryId');
  const currentCategory = categories.find(c => c._id === selectedCategoryId);
  const currentQuestions = currentCategory?.questions || [];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await client.fetch(FORM_CATEGORIES_QUERY);
        setCategories(data);
        
        // Auto-select category if param matches identifier
        if (categoriaParam && data.length > 0) {
          const matched = data.find((c: any) => c.identifier === categoriaParam);
          if (matched) {
            setValue('categoryId', matched._id);
          }
        }
      } catch (error) {
        // Silently fail
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [categoriaParam, setValue]);

  // Limpa campos dinâmicos ao trocar de categoria para evitar vazamento de dados
  useEffect(() => {
    if (selectedCategoryId) {
      const currentValues = watch();
      const baseFields = ['name', 'email', 'phone', 'categoryId'];
      const newValues: any = {};
      
      baseFields.forEach(field => {
        newValues[field] = currentValues[field] || '';
      });
      
      reset(newValues);
    }
  }, [selectedCategoryId, reset]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Busca a categoria pelo _id (que é o que está no Select)
      const categoryObj = categories.find(c => c._id === data.categoryId);
      const categoryName = categoryObj?.label || 'Geral';
      
      // Remove campos internos e prepara o payload
      const { categoryId, ...formData } = data;

      const payload = {
        ...formData,
        category: categoryName,
        timestamp: new Date().toISOString(),
      };

      // 3. Enviar para o Google Sheets (Web App)
      const result = await sendToGoogleSheets(payload);

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Formulário enviado com sucesso!");
        reset();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setSubmitError(true);
      toast.error("Ops! Algo deu errado ao enviar o formulário.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for Zod validation errors
  const onInvalid = (errors: any) => {
    const firstErrorKey = Object.keys(errors)[0];
    if (firstErrorKey) {
      const errorMessage = errors[firstErrorKey].message;
      toast.error(errorMessage);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <SEO title="Sucesso" description="Sua solicitação foi enviada com sucesso." />
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
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              className="w-full h-14 text-lg bg-fire-gradient hover:opacity-90 font-bold"
              onClick={() => setIsSubmitted(false)}
            >
              Preencher novo formulário
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full h-14 text-lg border-primary/20 hover:bg-accent/10 font-bold"
              onClick={() => navigate('/')}
            >
              Ir para a Home
            </Button>
          </div>
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
          <div className="flex flex-col gap-4">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-14 text-lg border-red-500/50 hover:bg-red-500/10 text-red-500 font-bold"
              onClick={() => setSubmitError(false)}
            >
              Tentar novamente
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="w-full h-14 text-lg hover:bg-accent/10 font-bold"
              onClick={() => navigate('/')}
            >
              Voltar para a Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <SEO 
        title={currentCategory ? `Solicitação: ${currentCategory.label}` : "Solicitações"} 
        description="Envie sua solicitação de oração, visita ou inscrição para a Juventude NV."
        canonical="/solicitacoes"
      />
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
            <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp / Telefone</Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        id="phone"
                        placeholder="(00) 00000-0000"
                        onChange={(e) => {
                          const masked = maskPhone(e.target.value);
                          field.onChange(masked);
                        }}
                        className={cn(
                          "bg-white text-black placeholder:text-gray-500",
                          errors.phone ? 'border-destructive ring-destructive/20' : ''
                        )}
                      />
                    )}
                  />
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
                </div>
              </div>

              <div className="relative">
                {selectedCategoryId && (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 pt-4"
                  >
                    <div className="space-y-2">
                      <Separator className="bg-border/50" />
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          Perguntas Específicas
                        </h3>
                        <p className="text-sm text-muted-foreground">Conte-nos mais detalhes sobre sua necessidade.</p>
                      </div>
                    </div>

                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.div
                        key={`questions-${selectedCategoryId}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                      >
                        {currentQuestions.map((q) => {
                          // Fallback caso o slug não esteja preenchido no Sanity
                          const fieldId = q.fieldName?.current || q.question.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                          
                          return (
                            <div key={fieldId} className="space-y-2">
                              <Controller
                                name={fieldId}
                                control={control}
                                rules={{ 
                                  required: q.required ? "Este campo é obrigatório" : false 
                                }}
                                render={({ field, fieldState: { error } }) => {
                                  const hasError = !!error;
                                  
                                  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                                    let val = e.target.value;
                                    if (q.fieldType === 'tel') val = maskPhone(val);
                                    if (q.fieldType === 'cpf') val = maskCPF(val);
                                    if (q.fieldType === 'date') val = maskDate(val);
                                    field.onChange(val);
                                  };

                                  return (
                                    <div className="space-y-2">
                                      <Label 
                                        htmlFor={fieldId}
                                        className={cn(hasError ? "text-destructive" : "")}
                                      >
                                        {q.question} {q.required && <span className="text-destructive">*</span>}
                                      </Label>
                                      
                                      {q.fieldType === 'textarea' ? (
                                        <Textarea
                                          {...field}
                                          value={field.value ?? ''}
                                          id={fieldId}
                                          placeholder={q.placeholder || "Digite aqui..."}
                                          onChange={handleChange}
                                          className={cn(
                                            "bg-white text-black min-h-[120px] resize-none",
                                            hasError ? "border-destructive ring-destructive/20" : ""
                                          )}
                                        />
                                      ) : (
                                        <Input
                                          {...field}
                                          value={field.value ?? ''}
                                          id={fieldId}
                                          type={q.fieldType === 'number' ? 'number' : 'text'}
                                          placeholder={q.placeholder || (q.fieldType === 'date' ? "DD/MM/AAAA" : "Digite aqui...")}
                                          onChange={handleChange}
                                          className={cn(
                                            "bg-white text-black h-12",
                                            hasError ? "border-destructive ring-destructive/20" : ""
                                          )}
                                        />
                                      )}
                                    </div>
                                  );
                                }}
                              />
                            </div>
                          );
                        })}
                      </motion.div>
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
