import { registerDecorator, ValidationOptions } from "class-validator";

export function IsUuidOrInt(options?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isUuidOrInt",
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: any) {
          if (typeof value === "number") return Number.isInteger(value) && value >= 0;
          if (typeof value !== "string") return false;
          const s = value.trim();
          const isInt = /^[0-9]+$/.test(s);
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);
          return isInt || isUuid;
        },
        defaultMessage: () => "productId debe ser UUID o entero",
      },
    });
  };
}
