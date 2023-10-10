export default async (req, context) => {
    if (context.cookies.get("nf_jwt")) {
        context.cookies.set({name: "nf_jwt2", value: access_token, "sameSite": "None"})
        return Response.redirect("https://sigpwny.com/admin");
    }
    return;
};

export const config = {
  path: "/"
};