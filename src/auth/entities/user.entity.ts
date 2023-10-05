import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {
    // Para ver como lucen los usuarios. Colocarle a todos prop y indicar parametros o reglas

    // _id:string => esto lo hace mongo automaticcamente. 
    @Prop({ unique: true, required: true})
    email: string;

    @Prop({required:true})
    nameL:string;

    @Prop({minlength:6, required:true})
    password:string;
    
    @Prop({default:true})
    isActive:boolean;

    @Prop({type: [String], default: ['user']}) //roles: user, Admin, otro
    roles:string[];
}

export const UserSchema = SchemaFactory.createForClass(User);