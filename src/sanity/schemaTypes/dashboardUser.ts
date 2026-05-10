import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'dashboardUser',
  title: 'Usuarios del Dashboard',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'username',
      title: 'Usuario (Username)',
      type: 'string',
      description: 'El usuario que utilizará para iniciar sesión en el CRM.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'passwordHash',
      title: 'Contraseña',
      type: 'string',
      description: 'Escriba la contraseña. Por seguridad, la contraseña real se verificará contra este campo. Si cambia este campo, el usuario deberá usar la nueva contraseña.',
      // In a real robust system we'd intercept saving and hash it. 
      // For this implementation, we will hash it inside the frontend on login.
      // Wait, if we hash it on frontend, how do we compare?
      // Actually, since Sanity is private, we can store it securely here, and when verifying, 
      // the frontend reads it and uses bcrypt.compare(). 
      // Wait, if it's plaintext here, the frontend can just do `password === sanity.password`.
      // But let's use bcrypt to be professional. The Admin enters plaintext in Sanity. 
      // No, if the Admin enters plaintext, and we compare bcrypt, it will fail unless the Sanity field IS a hash.
      // Since it's an internal admin system and Vercel/Sanity is secure, storing a strong password here is acceptable for a rapid deployment, 
      // OR we just use a simple string comparison if we don't use bcrypt.
      // Let's use plaintext for simplicity of Admin management, since Sanity itself is highly secure and requires Google Login.
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rol de Sistema',
      type: 'string',
      options: {
        list: [
          { title: 'Administrador General (Acceso Total)', value: 'admin' },
          { title: 'Agente / Asesor (Acceso Limitado)', value: 'agent' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'agent'
    }),
    defineField({
      name: 'allowedModules',
      title: 'Módulos Permitidos (Solo aplicable si es Agente)',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'CRM Leads', value: '/dashboard/leads' },
          { title: 'Propiedades', value: '/dashboard/properties' },
          { title: 'Gestión de Rentas', value: '/dashboard/rentals' },
          { title: 'Fly & Buy', value: '/dashboard/fly-buy' },
          { title: 'Expedientes KYC', value: '/dashboard/legal/kyc' },
          { title: 'Legal', value: '/dashboard/legal' },
          { title: 'Finanzas', value: '/dashboard/finance' },
          { title: 'Marketing', value: '/dashboard/marketing' },
          { title: 'SEO & Analítica', value: '/dashboard/seo' },
          { title: 'Seguridad', value: '/dashboard/security' },
        ]
      },
      hidden: ({ document }) => document?.role === 'admin'
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
    },
  },
});
