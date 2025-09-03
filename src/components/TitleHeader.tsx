import { TitleHeaderColor } from '../constants';

export const TitleHeader = ({ title }: { title: string }) => {
    return (
        <div
            className="h-28 w-full flex items-center px-6 fixed top-20 left-20 z-10"
            style={{ backgroundColor: TitleHeaderColor }}
        >
            <h1 className="text-2xl font-semibold text-white">
                {title}
            </h1>
        </div>
    );
};