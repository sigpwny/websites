export default async (req, context) => {
    
    if (context.cookies.get("nf_jwt")) {
        context.cookies.set({name: "nf_jwt2", value: context.cookies.get("nf_jwt"), sameSite: "None", secure: true})
        return Response.redirect("https://sigpwny.com/admin");
    }
    return;
};

export const config = {
  path: "/settings"
};