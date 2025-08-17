import { ProfileImage } from "./profile-image"
interface AvatarProfileProps {
    image: ProfileImageProps;
    userId: string;
}
interface ProfileImageProps {
  imageUrl?: string | null;
  alt?: string;
}

export function AvatarProfile({ image, userId }: AvatarProfileProps) {

  return (
    <div className="flex justify-center">
        <ProfileImage imageUrl={image.imageUrl} alt={image.alt} userId={userId} />
    </div>
  );
}