export function getDefaultUserPermissions() {
  return {
    navigation: {
      lista_artikla: true,
      porudzbine_rezervacije: true,
      boje_kategorije_dobavljaci: true,
      kuriri: true,
      dodaj_artikal: true,
      upravljanje_korisnicima: false,
      podesavanja: true,
      zavrsi_dan: true,
      admin_dashboard: false,
    },
    products: {
      create: true,
      update: true,
      delete: true,
    },
    orders: {
      create: true,
      update: true,
      delete: true,
    },
    packaging: {
      check: true,
      finish_packaging: true,
    },
    colors: {
      create: true,
      update: true,
      delete: true,
    },
    categories: {
      create: true,
      update: true,
      delete: true,
    },
    supplies: {
      create: true,
      update: true,
      delete: true,
    },
    couriers: {
      create: true,
      update: true,
      delete: true,
    },
  };
}
