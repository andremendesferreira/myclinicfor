// ==============================================
// profile-image.tsx
// ==============================================
import Image from 'next/image';
import imgDef from '../../../../../../public/prof1.jpg'

interface ProfileImageProps {
  imageUrl?: string | null;
  alt?: string;
}

export function ProfileImage({ imageUrl, alt = "Foto da clínica" }: ProfileImageProps) {
  return (
    <div className='flex justify-center'>
      <div className='bg-gray-200 relative h-40 w-40 rounded-full overflow-hidden'>
        <Image
          src={imageUrl || imgDef}
          alt={alt}
          fill
          className='object-cover'
        />
      </div>
    </div>
  );
}