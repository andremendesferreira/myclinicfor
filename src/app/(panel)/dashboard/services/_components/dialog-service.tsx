"use client"
import { useState } from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDialogServiceForm, DialogServiceFormData } from "./dialog-service-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { convertRealToCents } from '@/app/utils/convertCurrency';
import { creteNewService } from '../_act/create-service';
import { msgSuccess, msgError, msgWarning, msgInfo } from '@/components/custom-toast';

interface DialogServiceProps {
  closeModal: () => void;
}


export function DialogService({ closeModal }: DialogServiceProps) {

  const form = useDialogServiceForm();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: DialogServiceFormData){
    setLoading(true);
    const priceInCents = convertRealToCents(values.price)
    const hours = parseInt(values.hours) || 1;
    const minutes = parseInt(values.minutes) || 0;
    const duration = (hours * 60 ) + minutes;

    const response = await creteNewService({
      name: values.name,
      price: priceInCents,
      duration: duration
    })

    setLoading(false);

    if(response.error){
      msgError(response.error);
      return;
    }

    msgSuccess("Serviço cadastrado com sucesso!");
    
    handleCloseModal();

  }

  function handleCloseModal(){
    form.reset();
    closeModal();
  }

  function changeCurrency(event: React.ChangeEvent<HTMLInputElement>){
    let { value } = event.target;
    // Remover todos os caracteres não numéricos
    value = value.replace(/\D/g,'');
    
    if(value){
      // Valores em reais multiplicado por cem (* 100)
      // Valores em centavos dividido por cem  (/ 100)
      value = (parseInt(value,10)/100).toFixed(2);
      value = value.replace('.', ',');
      value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    event.target.value = value;

    form.setValue("price", value);
  }


  return (
    <>
      <DialogHeader>
        <DialogTitle>Novo Serviço</DialogTitle>
        <DialogDescription>
          Adicione um novo serviço de atendimento.
        </DialogDescription>
      </DialogHeader>
                                    
      <Form {...form}>
        <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2">

          <div className="flex flex-col">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Nome do serviço:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Digite o nome do serviço..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Valor do serviço:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 150,00"
                      onChange={changeCurrency}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <p className="font-semibold">Tempo de duração do serviço:</p>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Horas:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1"
                      min="0"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minutes"
              render={({ field }) => (
                <FormItem className="my-2">
                  <FormLabel className="font-semibold">
                    Minutos:
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="0"
                      min="0"
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            disabled={loading}
            type="submit" className="w-full font-semibold text-white bg-emerald-700 hover:bg-emerald-600 hover:shadow-sm hover:shadow-emerald-200">
            {loading ? "Cadastrando..." : "Salvar serviço"}
          </Button>
        </form>
      </Form>
    </>
  )
}