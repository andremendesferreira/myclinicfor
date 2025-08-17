"use client"
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import imgDef from '../../../../../../public/prof1.jpg'
import { Loader, Upload } from 'lucide-react';
import { msgError, msgWarning, msgInfo, msgSuccess } from '@/components/custom-toast';
import { updateUrlAvatar } from '../_act/upd-url-avatar';

interface ProfileImageProps {
  imageUrl?: string | null;
  alt?: string;
  userId: string
}

export function ProfileImage({ imageUrl, alt, userId }: ProfileImageProps) {
  const [previewImage, setPreviewImage] = useState(imageUrl);
  const [loading, setLoading] = useState(false);

  async function handleChange(e: ChangeEvent<HTMLInputElement>){
    if(e.target.files && e.target.files[0]){
      const file = e.target.files[0];
      setLoading(true);
      if(file.type !== "image/jpeg" && file.type !== "image/png"){
        msgError("Escolha uma imagem válida do tipo (JPEG ou PNG)");
        setLoading(false);
        return;
      }
      if(file.size > 1024 * 1024 * 2){ // 2MB
        msgWarning("A imagem deve ter no máximo 2MB");
        setLoading(false);
        return;
      }

      const fileName = userId; // Use userId as the file name
      const newFile = new File([file], fileName, { type: file.type });
      const newUrl = await uploadImage(newFile);

      if (!newUrl || newUrl === "" || newUrl === null) {
        msgError("Erro ao fazer upload da imagem.");
        setLoading(false);
        return;
      }

      setPreviewImage(newUrl);
      //
      // Update avatar url on database
      const res = await updateUrlAvatar({ image: newUrl });

      if (res.error) {
        msgError(res.error);
      } else {
        msgSuccess(res.data || "Imagem atualizada com sucesso!");
      }

      setLoading(false);
      
    }
  }

  async function uploadImage(image: File): Promise<string | null> {
    try {
      
      msgInfo("Enviado imagem ao repositório de arquivos.")
      const formData = new FormData();
      formData.append("file", image);
      formData.append("userId", userId);
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();

      if (response.status === 200) {
        msgInfo("Imagem enviada com sucesso!");
        return data.secure_url as string;
      }

      msgError("Erro ao enviar imagem.");
      return null;

    }catch(err){
      console.error('Error ao tentar fazer upload da imagem:', err);
      return null;
    }
  }

  return (
      <div className='relative w-40 h-40 md:w-48 md:h-48 bg-gray-200 rounded-full overflow-hidden'>
          <div className='relative flex items-center justify-end w-full h-full'>
            <label htmlFor="avatar" className="absolute cursor-pointer z-[2] hover:bg-slate-50/90 bg-slate-50/70 p-2 rounded-full shadow-xl mr-1">
                {
                  loading ? 
                  <Loader className="animate-spin" size={16} color="#131313"/> : 
                  <Upload size={16} color="#131313" />
                }
            </label>
            <input 
              type="file" 
              name="avatar" 
              id="avatar" 
              title="Upload profile image" 
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
              onChange={handleChange}
              accept="image/jpeg, image/png"
            />
          </div>
        <Image
          src={previewImage || imgDef}
          alt={alt || "Foto da clínica"}
          fill
          className='w-full h-48 object-cover rounded-full bg-slate-200'
          quality={100}
          priority
          sizes='(max-width: 480px) 100vw, (max-width: 1024px) 75vw, 60vw'
        />
    </div>
  );
}