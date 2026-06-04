import { Button } from "./Button";

export function Users({ user, onSendMoney }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex">
                <div className="rounded-full h-12 w-12 bg-black text-white flex justify-center mt-1 mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user.firstName[0]}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="mx-1 font-semibold">
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            </div>

            <div className="flex flex-col justify-center">
                <Button
                    onClick={() => onSendMoney(user._id, user.firstName)}
                    label={"Send Money"}
                />
            </div>
        </div>
    );
}
